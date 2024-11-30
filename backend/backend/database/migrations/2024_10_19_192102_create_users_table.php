<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('phone_number', 15)->nullable();
            $table->enum('role', ['superadmin', 'admin', 'user', 'customer', 'manager', 'marketplace'])->default('user');
            $table->string('profile_picture')->nullable();
            $table->enum('is_active', ['active', 'inactive'])->default('active');
            $table->foreignId('category_id')->nullable()->constrained('user_category')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
