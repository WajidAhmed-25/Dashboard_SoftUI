<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OrderInvoice;
class OrderInvoiceController extends Controller
{
    //
    public function index()
    {
        $invoices = OrderInvoice::with(['order', 'user'])->get();
        return response()->json($invoices);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:marketplace_orders,id',
            'user_id' => 'required|exists:users,id',
            'amount' => 'required|numeric',
            'status' => 'required|string',
        ]);
        $invoice = OrderInvoice::create($validated);
        return response()->json($invoice, 201);
    }

    public function show($id)
    {
        $invoice = OrderInvoice::with(['order', 'user'])->findOrFail($id);
        return response()->json($invoice);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'order_id' => 'sometimes|required|exists:marketplace_orders,id',
            'user_id' => 'sometimes|required|exists:users,id',
            'amount' => 'sometimes|required|numeric',
            'status' => 'sometimes|required|string',
        ]);
        
        $invoice = OrderInvoice::findOrFail($id);
        $invoice->update($validated);
        return response()->json($invoice);
    }

    public function destroy($id)
    {
        OrderInvoice::destroy($id);
        return response()->json(null, 204);
    }
}
