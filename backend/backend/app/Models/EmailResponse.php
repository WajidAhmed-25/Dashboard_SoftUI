<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailResponse extends Model
{
    use HasFactory;
    protected $fillable = ['email_subject', 'category', 'priority', 'size', 'placement', 'order_type', 'required_file_format', 'number_of_colors', 'colors_list', 'other_details', 'garment_type', 'sentiments', 'attachments', 'date', 'email_address', 'client_code', 'price', 'color', 'project_tag', 'assign_order_to_designer'];

    public function assignedOrder()
    {
        // return $this->hasOne(AssignOrder::class);
        return $this->hasOne(AssignOrder::class, 'order_id', 'id')->with('user');
    }

    public function orderLogs()
    {
        return $this->hasMany(OrderLog::class);
    }

    public function orderStatus()
    {
        return $this->hasMany(OrderStatus::class);
    }

    public function orderInvoice()
    {
        return $this->hasOne(OrderInvoice::class);
    }

    public function marketplaceOrder()
    {
        return $this->hasOne(MarketplaceOrder::class);
    }
}
