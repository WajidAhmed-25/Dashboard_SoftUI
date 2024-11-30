<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Models\UserDetail;
class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            // Validate the incoming request data
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'last_name' => 'nullable|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
                'phone_number' => 'nullable|string',
                'category_id' => 'required|exists:user_category,id',
                'role' => 'nullable|string|in:admin,user,account,designer',
            ]);
    
            // Create the user
            $user = User::create([
                'name' => $request->name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone_number' => $request->phone_number,
                'category_id' => $request->category_id,
                'role' => $request->role ?? 'user', // Default to 'user' if role is not provided
            ]);
    
            // Return success message as JSON
            return response()->json([
                'success' => true,
                'message' => 'User registered successfully',
                'user' => $user
            ], 201);
    
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Catch validation errors and return them as JSON
            return response()->json([
                'errors' => $e->errors(),
                'message' => 'Validation failed'
            ], 422);
            
        } catch (\Exception $e) {
            // Catch any other errors and return a general error message
            return response()->json([
                'message' => 'Something went wrong, please try again',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    


    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|string|email',
                'password' => 'required|string',
                'role' => 'required|string',  
            ]);
    
            $user = User::where('email', $request->email)->first();
    
            if (!$user) {
                return response()->json(['status' => "error", 'message' => 'User not found'], 404);
            }
    
            if (!Hash::check($request->password, $user->password)) {
                return response()->json(['status' => "error", 'message' => 'Invalid login credentials'], 401);
            }
    

            if ($user->role !== $request->role) {
                return response()->json(['status' => "error", 'message' => 'Role does not match'], 403);
            }
    
            return response()->json([
                'status' => "success",
                'message' => 'User logged in successfully',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
            ], 200); 
    
        } catch (\Exception $e) {
            return response()->json([
                'status' => "error",
                'message' => 'Something went wrong, please try again',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    



    public function changePassword(Request $request)
    {
        try {
            // Validate the request
            $request->validate([
                'user_id' => 'required',
                'old_password' => 'required|string',
                'new_password' => 'required|string', // Confirm new password
            ]);

            // Get the currently authenticated user
            $user = User::find($request->user_id);
            if (!$user) {
                return response()->json(['error' => true,'message' => 'Invalid login User'], 401);
            }

            // Check if the old password matches the current password
            if (!Hash::check($request->old_password, $user->password)) {
                return response()->json(['error' => true,'message' => 'Old password is incorrect'], 401);
            }

            // Update the password
            $user->update([
                'password' => Hash::make($request->new_password),
            ]);

            return response()->json(['success' => true,'message' => 'Password changed successfully']);

        } catch (\Exception $e) {
            // Catch any other errors and return a general error message
            return response()->json([
                'message' => 'Something went wrong, please try again',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }



    public function deleteUser(Request $request)
    {
        try {

            $request->validate([
                'user_id' => 'required',
            ]);
            // Find the user by ID
            $user = User::find($request->user_id);

            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            // Delete the user
            $user->delete();

            return response()->json(['success' => true, 'message' => 'User deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Something went wrong, please try again',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Edit or update a user
    public function editUser(Request $request, $id)
    {
        try {
            // Find the user by ID
            $user = User::find($id);

            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            // Validate the request, including the optional profile photo
            $validatedData = $request->validate([
                'name' => 'nullable|string|max:255',
                'last_name' => 'nullable|string|max:255',
                'email' => 'nullable|string|email|max:255|unique:users,email,' . $id,
                'password' => 'nullable|string|min:8',
                'phone_number' => 'nullable|string',
                'role' => 'nullable|string',
                'category_id' => 'nullable|exists:user_category,id',
                'profile' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validate the profile photo
            ]);

            // Check if the request has a file for the profile photo
            if ($request->hasFile('profile')) {
                // Get the uploaded file
                $profileImage = $request->file('profile');

                // Define the file name and path
                $fileName = time() . '_' . $profileImage->getClientOriginalName();

                // Store the file in the 'public/profile_photos' folder
                $filePath = $profileImage->storeAs('profile_photos', $fileName, 'public');

                // Save the file path to the user's profile field in the database
                $user->profile = '/storage/' . $filePath;
            }

            // Update the user details (only update fields that are provided)
            $user->update([
                'name' => $request->name ?? $user->name,
                'last_name' => $request->last_name ?? $user->last_name,
                'email' => $request->email ?? $user->email,
                'password' => $request->password ? Hash::make($request->password) : $user->password,
                'phone_number' => $request->phone_number ?? $user->phone_number,
                'role' => $request->role ?? $user->role,
                'category_id' => $request->category_id ?? $user->category_id,
                'profile' => $user->profile, // Ensure profile photo path is saved
            ]);

            return response()->json(['success' => true, 'message' => 'User updated successfully', 'user' => $user], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'errors' => $e->errors(),
                'message' => 'Validation failed'
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Something went wrong, please try again',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
