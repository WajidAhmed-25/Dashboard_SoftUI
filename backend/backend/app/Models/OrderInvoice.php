<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderInvoice extends Model
{
    use HasFactory;
    protected $fillable = ['order_id', 'user_id', 'total_price', 'invoice_path', 'is_active'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function emailResponse()
    {
        return $this->belongsTo(EmailResponse::class);
    }
}
