<?php

namespace App\Http\Controllers;

use App\Models\OrderLog;
use Illuminate\Http\Request;

use App\Models\EmailResponse;

class OrderLogController extends Controller
{
    public function index()
    {
        $logs = OrderLog::with(['user', 'emailResponse'])->get();
        return response()->json($logs);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:email_responses,id',
            'user_id' => 'required|exists:users,id',
            'status' => 'required|string',
            'description' => 'required|string',
        ]);
        $log = OrderLog::create($validated);
        return response()->json($log, 201);
    }

    public function show($id)
    {
        $log = OrderLog::with(['user', 'emailResponse'])->findOrFail($id);
        return response()->json($log);
    }

    // public function logsByOrderId($id)
    // {
    //     $logs = OrderLog::with(['user'])->where('id', $id)->get();

    //     return response()->json($logs);
    // }

    public function logsByOrderId($id)
{
 
    $logs = OrderLog::with(['user', 'emailResponse'])->where('id', $id)->get();

    return response()->json([
        'logs' => $logs,
    ]);
}



    
    public function logsByStatus($status)
    {
        $logs = OrderLog::with(['user', 'emailResponse'])->where('status', $status)->get();
        return response()->json($logs);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'order_id' => 'sometimes|required|exists:email_responses,id',
            'user_id' => 'sometimes|required|exists:users,id',
            'status' => 'sometimes|required|string',
            'description' => 'sometimes|required|string',
        ]);

        $log = OrderLog::findOrFail($id);
        $log->update($validated);
        return response()->json($log);
    }

    public function destroy($id)
    {
        OrderLog::destroy($id);
        return response()->json(null, 204);
    }
}
