<?php

namespace App\Http\Controllers;

use App\Models\UserCategory;
use Illuminate\Http\Request;

class UserCategoryController extends Controller
{
    // Display a listing of user categories (SELECT)
    public function index()
    {
        $categories = UserCategory::all(); // Fetch all categories
        return response()->json($categories);
    }

    // Show the form for creating a new user category (not necessary if using APIs)
    public function create()
    {
        //
    }

    // Store a newly created user category (INSERT)
    public function store(Request $request)
    {
        try {
            // Validate the request
            $request->validate([
                'category' => 'required|string|max:255',
            ]);

            // Check if the category already exists
            $existingCategory = UserCategory::where('category', $request->category)->first();

            if ($existingCategory) {
                // Return a response indicating that the category already exists
                return response()->json([
                    'error' => false,
                    'message' => 'Category already exists'
                ], 422); // 409 Conflict status code
            }

            // Create the category if it does not exist
            $category = UserCategory::create([
                'category' => $request->category,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Category created successfully',
                'category' => $category
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


    // Display the specified user category (SELECT)
    public function show($id)
    {
        $category = UserCategory::findOrFail($id);
        return response()->json($category);
    }

    // Show the form for editing the specified user category (not necessary if using APIs)
    public function edit($id)
    {
        //
    }

    // Update the specified user category (UPDATE)
    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'category' => 'required|string|max:255',
                'is_active' => 'nullable|string|max:255',
            ]);


            $category = UserCategory::findOrFail($id);

            // Update the category and status directly
            $category->category = $request->category ?? $category->category;
            $category->is_active = $request->is_active ?? 'inactive'; // Use 'inactive' as fallback if status is not provided

            // Save the changes to the model
            $category->save();

            return response()->json(["success" => true,'message' => 'Category updated successfully', 'category' => $category], 200);
        
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Catch validation errors and return them as JSON
            return response()->json([
                'errors' => $e->errors(),
                'message' => 'Validation failed'
            ], 422);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Return a JSON response if the category is not found
            return response()->json(["error" => $e->getMessage(), 'message' => 'Category Not Found'], 422);
        } catch (\Exception $e) {
            // Catch any other errors and return a general error message
            return response()->json([
                'message' => 'Something went wrong, please try again',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Remove the specified user category (DELETE)
    public function destroy($id)
    {
        try {
            $category = UserCategory::findOrFail($id);
            $category->delete();

            return response()->json(['success' => true , 'message' => 'Category deleted successfully'], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Return a JSON response if the category is not found
            return response()->json(["error" => $e->getMessage(), 'message' => 'Category Not Found'], 422);
        } catch (\Exception $e) {
            // Catch any other errors and return a general error message
            return response()->json([
                'message' => 'Something went wrong, please try again',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
