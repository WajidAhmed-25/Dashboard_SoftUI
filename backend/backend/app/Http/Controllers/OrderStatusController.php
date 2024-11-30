<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OrderStatus;
class OrderStatusController extends Controller
{
    //
    public function index()
    {
        $statuses = OrderStatus::all();
        return response()->json($statuses);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:email_responses,id',
            'status' => 'required|string',
        ]);
        $status = OrderStatus::create($validated);
        return response()->json($status, 201);
    }

    public function show($id)
    {
        $status = OrderStatus::findOrFail($id);
        return response()->json($status);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'order_id' => 'sometimes|required|exists:email_responses,id',
            'status' => 'sometimes|required|string',
        ]);
        
        $status = OrderStatus::findOrFail($id);
        $status->update($validated);
        return response()->json($status); 
    }

    public function destroy($id)
    {
        OrderStatus::destroy($id);
        return response()->json(null, 204);
    }
}
