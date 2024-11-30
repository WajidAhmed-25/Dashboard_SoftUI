<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignOrder extends Model
{
    use HasFactory;
    protected $fillable = ['order_id', 'user_id', 'status', 'is_active'];

    protected $table="assign_order";
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function emailResponse()
    {
        return $this->belongsTo(EmailResponse::class);
    }
}
