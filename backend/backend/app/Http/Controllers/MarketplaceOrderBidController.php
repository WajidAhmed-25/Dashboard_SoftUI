<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MarketplaceOrderBid;

class MarketplaceOrderBidController extends Controller
{
    //
    public function index()
    {
        $bids = MarketplaceOrderBid::with(['order', 'user'])->get();
        return response()->json($bids);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:marketplace_orders,id',
            'user_id' => 'required|exists:users,id',
            'bid_amount' => 'required|numeric',
            'status' => 'required|string',
        ]);
        $bid = MarketplaceOrderBid::create($validated);
        return response()->json($bid, 201);
    }

    public function show($id)
    {
        $bid = MarketplaceOrderBid::with(['order', 'user'])->findOrFail($id);
        return response()->json($bid);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'order_id' => 'sometimes|required|exists:marketplace_orders,id',
            'user_id' => 'sometimes|required|exists:users,id',
            'bid_amount' => 'sometimes|required|numeric',
            'status' => 'sometimes|required|string',
        ]);
        
        $bid = MarketplaceOrderBid::findOrFail($id);
        $bid->update($validated);
        return response()->json($bid);
    }

    public function destroy($id)
    {
        MarketplaceOrderBid::destroy($id);
        return response()->json(null, 204);
    }
}
