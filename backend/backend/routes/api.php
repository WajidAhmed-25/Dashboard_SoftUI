<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserCategoryController;
use App\Http\Controllers\EmailResponseController;
use App\Http\Controllers\AssignOrderController;
use App\Http\Controllers\OrderLogController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::middleware('web')->get('/csrf-token', function () {
    return response()->json(['csrfToken' => csrf_token()]);
});


// Route::middleware(['api.key'])->group(function () {

    Route::post('/user/register', [AuthController::class, 'register']);
    Route::post('/user/login', [AuthController::class, 'login']);
    Route::post('/user/change-password', [AuthController::class, 'changePassword']);
    Route::post('/user/delete/', [AuthController::class, 'deleteUser']);
    Route::post('/user/update/{id}', [AuthController::class, 'editUser']);

    Route::get('/user/get_designer/', [UserController::class, 'get_designer']);


    Route::get('/users', [UserController::class, 'getAll']);

    // USER CATEGORY API
    Route::get('/user_category/', [UserCategoryController::class, 'index']);
    Route::post('/user_category/add', [UserCategoryController::class, 'store']);
    Route::post('/user_category/update/{id}', [UserCategoryController::class, 'update']);
    Route::post('/user_category/delete/{id}', [UserCategoryController::class, 'destroy']);



    Route::get('/email_response/get', [EmailResponseController::class, 'index']);
    Route::get('/email_response/get/{category}', [EmailResponseController::class, 'newOrder']);
    Route::get('/email_response/fetch/{id}', [EmailResponseController::class, 'show']);
    Route::post('/email_response/update/{id}', [EmailResponseController::class, 'update']);
    Route::post('/email_response/fileupload/', [EmailResponseController::class, 'fileupload']);

    Route::post('/email_response/tags/{id}', [EmailResponseController::class, 'updatetags']);
    // Route::get('/email_response/get/edit_request', [EmailResponseController::class, 'editRequest']);

    Route::get('/email-responses/all', [EmailResponseController::class, 'getAllEmailResponse']);

    Route::get('/email-responses/get_by_id/{id}', [EmailResponseController::class, 'getEmailResponseById']);



    // Oder
    // Route::get('/order/logs/{id}', [OrderLogController::class, 'logs']);
    // Route::post('/order/assign', [AssignOrderController::class, 'store']);


// Order - log controller 

Route::get('/order-logs', [OrderLogController::class, 'index']); // Get all logs
Route::post('/order-logs', [OrderLogController::class, 'store']); // Create a new log
Route::get('/order-logs/{id}', [OrderLogController::class, 'show']); // Get a log by ID
Route::get('/order-logs/order/{id}', [OrderLogController::class, 'logsByOrderId']); // Get logs by order ID
Route::get('/order-logs/status/{status}', [OrderLogController::class, 'logsByStatus']); // Get logs by status
Route::put('/order-logs/{id}', [OrderLogController::class, 'update']); // Update a log by ID
Route::delete('/order-logs/{id}', [OrderLogController::class, 'destroy']); // Delete a log by ID
// });