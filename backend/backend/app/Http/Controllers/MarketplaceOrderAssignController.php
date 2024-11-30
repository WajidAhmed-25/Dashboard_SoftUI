<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MarketplaceOrderAssign;

class MarketplaceOrderAssignController extends Controller
{
    //
    public function index()
    {
        $assignments = MarketplaceOrderAssign::with(['order', 'user'])->get();
        return response()->json($assignments);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:marketplace_orders,id',
            'user_id' => 'required|exists:users,id',
            'status' => 'required|string',
        ]);
        $assignment = MarketplaceOrderAssign::create($validated);
        return response()->json($assignment, 201);
    }

    public function show($id)
    {
        $assignment = MarketplaceOrderAssign::with(['order', 'user'])->findOrFail($id);
        return response()->json($assignment);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'order_id' => 'sometimes|required|exists:marketplace_orders,id',
            'user_id' => 'sometimes|required|exists:users,id',
            'status' => 'sometimes|required|string',
        ]);
        
        $assignment = MarketplaceOrderAssign::findOrFail($id);
        $assignment->update($validated);
        return response()->json($assignment);
    }

    public function destroy($id)
    {
        MarketplaceOrderAssign::destroy($id);
        return response()->json(null, 204);
    }
}
