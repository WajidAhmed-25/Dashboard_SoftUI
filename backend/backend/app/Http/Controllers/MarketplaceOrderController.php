<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MarketplaceOrder;
class MarketplaceOrderController extends Controller
{
    //
    public function index()
    {
        $orders = MarketplaceOrder::with(['user', 'orderStatus'])->get();
        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'order_status_id' => 'required|exists:order_statuses,id',
            'description' => 'required|string',
            'price' => 'required|numeric',
        ]);
        $order = MarketplaceOrder::create($validated);
        return response()->json($order, 201);
    }

    public function show($id)
    {
        $order = MarketplaceOrder::with(['user', 'orderStatus'])->findOrFail($id);
        return response()->json($order);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'user_id' => 'sometimes|required|exists:users,id',
            'order_status_id' => 'sometimes|required|exists:order_statuses,id',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric',
        ]);
        
        $order = MarketplaceOrder::findOrFail($id);
        $order->update($validated);
        return response()->json($order);
    }

    public function destroy($id)
    {
        MarketplaceOrder::destroy($id);
        return response()->json(null, 204);
    }
}
