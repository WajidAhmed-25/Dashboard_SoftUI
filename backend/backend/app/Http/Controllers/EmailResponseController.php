<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\EmailResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
class EmailResponseController extends Controller
{



    public function getEmailResponseById($id)
{
    // Find the email response by ID
    $emailResponse = EmailResponse::find($id);

    // Check if the record exists
    if (!$emailResponse) {
        return response()->json([
            'success' => false,
            'message' => 'Email response not found',
        ], 404); // HTTP 404 Not Found
    }

    // Return the email response
    return response()->json([
        'success' => true,
        'data' => $emailResponse,
    ], 200); // HTTP 200 OK
}








    public function getAllEmailResponse()
{
    // Fetch all data from the EmailResponse table
    $emailResponses = EmailResponse::all();

    // Return the response as JSON
    return response()->json([
        'success' => true,
        'data' => $emailResponses
    ], 200); // HTTP 200 OK
}







    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request) // Ensure to import the Request class at the top
    {
        // Get search term and pagination settings from the request
        $searchTerm = $request->input('search');
        $perPage = $request->input('per_page') === 'all' ? EmailResponse::count() : $request->input('per_page', 1);

        // Build the query to get EmailResponse records
        $TypeQuery = EmailResponse::select('*');

        // If a search term is provided, add where clauses for filtering
        if ($searchTerm) {
            $TypeQuery->where(function($query) use ($searchTerm) {
                $query->where('email_subject', 'LIKE', "%{$searchTerm}%") // Adjusted to use existing column names
                    ->orWhere('category', 'LIKE', "%{$searchTerm}%") // Assuming 'category' is a valid column
                    ->orWhere('priority', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('size', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('placement', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('order_type', 'LIKE', "%{$searchTerm}%");
            });
        }

        // Paginate the results based on the specified or default value
        $emailResponses = $TypeQuery->paginate($perPage);

        // Return the response as JSON
        return response()->json($emailResponses);
    }




    // public function newOrder(Request $request,$category) // Ensure to import the Request class at the top
    // {   
    //     $q = $category;
    //     if (!$q) {
    //         return response()->json([
    //             'status' => "error",
    //             'success' => false,
    //             'message' => 'This Category have no data',
    //             'data' => ""
    //         ], 422); // HTTP 201 Created
    //     }
    //     $category='';
    //     switch ($q) {
    //         case 'new_order':
    //             $category = 'New Order';
    //             break;
    //         case 'edit_request':
    //             $category = 'Edit Request';
    //             break;
    //         case 'quote_request':
    //             $category = 'Quote Request';
    //             break;
    //         case 'feedback':
    //             $category = 'Feedback';
    //             break;
    //         case 'promotional_email':
    //             $category = 'Promotional Email';
    //             break;
    //         case 'customer_not_happy':
    //             $category = 'Customer Not Happy';
    //             break;
    //         case 'payment':
    //             $category = 'Payment';
    //             break;
    //         case 'follow_up':
    //             $category = 'Follow Up';
    //             break;
    //         case 'auto_reply':
    //             $category = 'Auto Reply';
    //             break;
    //         case 'other_email':
    //             $category = 'Other Email';
    //             break;
    //         case 'assign_order':
    //             $category = 'Assign Order';
    //             break;
    //         default:
    //             $category = '';
    //     }
    //     // Get search term and pagination settings from the request
    //     $searchTerm = $request->input('search');
    //     $perPage = $request->input('per_page') === 'all' ? EmailResponse::count() : $request->input('per_page', 30);

    //     // Build the query to get EmailResponse records, starting with filtering by category 'New Order'
    //     $TypeQuery = EmailResponse::select('*')->where('category',$category);

    //     // If a search term is provided, add where clauses for filtering
    //     if ($searchTerm) {
    //         $TypeQuery->where(function($query) use ($searchTerm) {
    //             $query->where('email_subject', 'LIKE', "%{$searchTerm}%")
    //                 ->orWhere('category', 'LIKE', "%{$searchTerm}%")
    //                 ->orWhere('priority', 'LIKE', "%{$searchTerm}%")
    //                 ->orWhere('size', 'LIKE', "%{$searchTerm}%")
    //                 ->orWhere('placement', 'LIKE', "%{$searchTerm}%")
    //                 ->orWhere('order_type', 'LIKE', "%{$searchTerm}%");
    //         });
    //     }

    //     // Add sorting in descending order, for example, by 'created_at' column
    //     $TypeQuery->orderBy('created_at', 'DESC');

    //     // Paginate the results based on the specified or default value
    //     $emailResponses = $TypeQuery->paginate($perPage);

    //     // Return the response as JSON
    //     return response()->json($emailResponses);
    // }





    public function newOrder(Request $request, $category)
{   
    $q = $category;
    if (!$q) {
        return response()->json([
            'status' => "error",
            'success' => false,
            'message' => 'This Category have no data',
            'data' => ""
        ], 422);
    }

    // Define excluded categories
    $excludedCategories = ['Follow Up', 'New Order', 'Edit Request'];
    
    // Define the category mappings
    $categoryMappings = [
        'new_order' => 'New Order',
        'edit_request' => 'Edit Request',
        'quote_request' => 'Quote Request',
        'feedback' => 'Feedback',
        'promotional_email' => 'Promotional Email',
        'customer_not_happy' => 'Customer Not Happy',
        'payment' => 'Payment',
        'follow_up' => 'Follow Up',
        'auto_reply' => 'Auto Reply',
        'other_email' => 'Other Email',
        'assign_order' => 'Assign Order',
        'submitted' => 'Submitted',
        'order_rejected' => 'Rejected'


    ];

    // Get the category from mappings or empty string if not found
    $category = $categoryMappings[$q] ?? '';

    // Get search term and pagination settings from the request
    $searchTerm = $request->input('search');
    $perPage = $request->input('per_page') === 'all' ? EmailResponse::count() : $request->input('per_page', 30);

    // Build the query
    $TypeQuery = EmailResponse::select('*');

    if ($q === 'except') {
        // If 'except' is specified, exclude the defined categories
        $TypeQuery->whereNotIn('category', $excludedCategories);
    } else {
        // Otherwise, filter by the specific category
        $TypeQuery->where('category', $category);
    }

    // If a search term is provided, add where clauses for filtering
    if ($searchTerm) {
        $TypeQuery->where(function($query) use ($searchTerm) {
            $query->where('email_subject', 'LIKE', "%{$searchTerm}%")
                ->orWhere('category', 'LIKE', "%{$searchTerm}%")
                ->orWhere('priority', 'LIKE', "%{$searchTerm}%")
                ->orWhere('size', 'LIKE', "%{$searchTerm}%")
                ->orWhere('placement', 'LIKE', "%{$searchTerm}%")
                ->orWhere('order_type', 'LIKE', "%{$searchTerm}%");
        });
    }

    // Add sorting
    $TypeQuery->orderBy('created_at', 'DESC');

    // Paginate the results
    $emailResponses = $TypeQuery->paginate($perPage);

    // Return the response as JSON
    return response()->json($emailResponses);
}












    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validate the incoming request data
        $validator = Validator::make($request->all(), [
            'email_subject' => 'required',
            'category' => 'required',
            'priority' => 'required',
            'size' => 'required',
            'placement' => 'required',
            'order_type' => 'required',
            'required_file_format' => 'required|max:50',
            'number_of_colors' => 'required',
            'colors_list' => 'required',
            'other_details' => 'nullable',
            'garment_type' => 'required',
            'sentiments' => 'required|max:100',
            'attachments' => 'nullable|max:500',
            'date' => 'required',
            'email_address' => 'required|email',
            'client_code' => 'required',
            'price' => 'required',
            'color' => 'required',
            'project_tag' => 'nullable',
            'assign_order_to_designer' => 'nullable|integer',
        ]);

        // Return validation errors if any
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422); // Unprocessable Entity
        }

        // Create the email response record
        $emailResponse = EmailResponse::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Email response created successfully',
            'data' => $emailResponse
        ], 201); // HTTP 201 Created
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $emailResponse = EmailResponse::with("assignedOrder")->find($id);

        if (!$emailResponse) {
            return response()->json([
                'success' => false,
                'message' => 'Email response not found'
            ], 404); // Not Found
        }

        return response()->json([
            'success' => true,
            'data' => $emailResponse
        ], 200); // HTTP 200 OK
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $emailResponse = EmailResponse::find($id);

        if (!$emailResponse) {
            return response()->json([
                'success' => false,
                'message' => 'Email response not found'
            ], 404); // Not Found
        }

        // Validate the incoming request data
        $validator = Validator::make($request->all(), [
            'email_subject' => 'required',
            'category' => 'required',
            'priority' => 'nullable',
            'size' => 'nullable',
            'placement' => 'nullable',
            'order_type' => 'nullable',
            'required_file_format' => 'nullable',
            'number_of_colors' => 'nullable',
            'colors_list' => 'nullable',
            'other_details' => 'nullable',
            'garment_type' => 'nullable',
            'sentiments' => 'nullable',
            'attachments' => 'nullable',
            'date' => 'nullable',
            'email_address' => 'required',
            'client_code' => 'nullable',
            'price' => 'nullable',
            'color' => 'nullable',
            'project_tag' => 'nullable',
            'assign_order_to_designer' => 'nullable|integer',
        ]);

        // Return validation errors if any
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422); // Unprocessable Entity
        }

        // Update the email response
        $emailResponse->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Email response updated successfully',
            'data' => $emailResponse
        ], 200); // HTTP 200 OK
    }
    public function updatetags(Request $request, $id)
    {
        $emailResponse = EmailResponse::find($id);

        if (!$emailResponse) {
            return response()->json([
                'success' => false,
                'message' => 'Email response not found'
            ], 404); // Not Found   
        }

        // Validate the incoming request data
        $validator = Validator::make($request->all(), [
            'project_tag' => 'required',
        ]);

        // Return validation errors if any
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422); // Unprocessable Entity
        }

        // Update the email response
        $emailResponse->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Email response updated successfully',
            'data' => $emailResponse
        ], 200); // HTTP 200 OK
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $emailResponse = EmailResponse::find($id);

        if (!$emailResponse) {
            return response()->json([
                'success' => false,
                'message' => 'Email response not found'
            ], 404); // Not Found
        }

        $emailResponse->delete();

        return response()->json([
            'success' => true,
            'message' => 'Email response deleted successfully'
        ], 200); // HTTP 200 OK
    }


    public function fileupload(Request $request)
    {
            // Check if a file is present in the request
            if ($request->hasFile('file') && $request->file('file')->isValid()) {
                // Get the uploaded file
                $file = $request->file('file');

                // Get the original file name and extension
                $originalFileName = $file->getClientOriginalName();
                $fileExtension = $file->getClientOriginalExtension();

                // Define a custom prefix (generate a random string of 8 characters)
                $prefix = Str::random(8) . '_';

                // Create the new file name by adding the prefix to the original name (before the extension)
                $newFileName = $prefix . pathinfo($originalFileName, PATHINFO_FILENAME) . '.' . $fileExtension;

                // Save the file to the storage/app/public directory
                // Make sure you have a symbolic link created with `php artisan storage:link`
                $filePath = $file->storeAs('public/uploads', $newFileName);

                // Check if the file was stored successfully
                if ($filePath) {
                    return response()->json([
                        'status' => 'success',
                        'message' => 'File uploaded successfully!',
                        'file_path' => Storage::url($filePath), // Public URL to access the file
                        'new_file_name' => $newFileName
                    ], 200);
                } else {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Failed to upload the file.'
                    ], 500);
                }
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'File upload error or no file uploaded.'
                ], 400);
            }
    }
}
