<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserCategory;
use Illuminate\Support\Facades\DB;
class UserController extends Controller
{



    public function getAll()
    {
        // Retrieve all users with their related category details (if applicable)
        $users = User::with('category') // Assuming there's a relationship set up with UserCategory
                    ->get();

        // Return the data as JSON
        return response()->json($users);
    }
    



    //
    public function get_designer()
    {   

        // $sql = "
        //     SELECT 
        //         u.id AS designer_id,
        //         u.name AS designer_name,
        //         COUNT(CASE WHEN MONTH(a.created_at) = MONTH(CURRENT_DATE()) THEN 1 END) AS monthly_design,
        //         COUNT(CASE WHEN a.status = 'Pending' THEN 1 END) AS pending_design,
        //         u.category_id AS level
        //     FROM 
        //         user u
        //     LEFT JOIN 
        //         assign_order a ON u.id = a.user_id
        //     WHERE 
        //         u.category_id = (SELECT id FROM user_category WHERE category = 'Production')
        //     GROUP BY 
        //         u.id;
        // ";

        $productionCategoryId = UserCategory::where('category', 'Production')->first()->id;

        $designers = User::select(
                        'users.id as designer_id',
                        'users.name as designer_name',
                        'users.category_id as level',
                        DB::raw("COUNT(CASE WHEN MONTH(assign_order.created_at) = MONTH(CURRENT_DATE()) THEN 1 END) as monthly_design"),
                        DB::raw("COUNT(CASE WHEN assign_order.status = 'Pending' THEN 1 END) as pending_design")
                    )
                    ->leftJoin('assign_order', 'users.id', '=', 'assign_order.user_id')
                    ->where('users.category_id', $productionCategoryId)
                    ->groupBy('users.id', 'users.name', 'users.category_id')  // Added other columns to group by
                    ->get();

        return response()->json($designers);

    }
}
