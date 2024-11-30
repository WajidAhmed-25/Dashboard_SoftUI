<?php

namespace App\Http\Controllers;
use App\Models\AssignOrder;
use Illuminate\Http\Request;
use App\Models\OrderLog;
class AssignOrderController extends Controller
{
    //
    public function index()
    {
        $assignments = AssignOrder::with(['user', 'emailResponse'])->get();
        return response()->json($assignments);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:email_responses,id',
            'user_id' => 'required|exists:users,id',
            'status' => 'required|string',
        ]);

        $validated3 =[
            'order_id' =>$validated['order_id'],
            'user_id' => $validated['user_id'],
            'status' => 'Assign',
        ];
        // Check if the order log already exists
        $assignment = AssignOrder::where('order_id', $validated['order_id'])->first();
        $log = OrderLog::where('order_id', $validated['order_id'])->first();

        if ($assignment) {
            // Update the existing log
            
            if($assignment->user_id == $validated['user_id']){
                return response()->json($assignment, 201);
            }
            if($log){
                $validated2 =[
                    'order_id' =>$validated['order_id'],
                    'user_id' => $assignment->user_id,
                    'status' => 'canceled',
                ];
                $log = OrderLog::create($validated2);
            }
            
            $log = OrderLog::create($validated3);
            $assignment->user_id = $validated['user_id'];
            $assignment->status = $validated['status'];
            $assignment->update($validated);
        } else {
            // Insert a new log
            $log = OrderLog::create($validated3);
            $assignment = AssignOrder::create($validated);
        }

        // $log = OrderLog::create($validated);

        return response()->json($assignment, 201);
    }

    public function show($id)
    {
        $assignment = AssignOrder::with(['user', 'emailResponse'])->findOrFail($id);
        return response()->json($assignment);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'order_id' => 'sometimes|required|exists:email_responses,id',
            'user_id' => 'sometimes|required|exists:users,id',
            'status' => 'sometimes|required|string',
        ]);
        
        $assignment = AssignOrder::findOrFail($id);
        $assignment->update($validated);
        return response()->json($assignment);
    }

    public function destroy($id)
    {
        AssignOrder::destroy($id);
        return response()->json(null, 204);
    }
}
