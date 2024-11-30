<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmailResponsesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('email_responses', function (Blueprint $table) {
            $table->id();
            $table->string('email_subject')->nullable();
            $table->string('category')->nullable();
            $table->string('priority')->nullable();
            $table->string('size')->nullable();
            $table->string('placement')->nullable();
            $table->string('order_type')->nullable();
            $table->string('required_file_format')->nullable();
            $table->string('number_of_colors')->nullable();
            $table->string('colors_list')->nullable();
            $table->text('other_details')->nullable();
            $table->string('garment_type')->nullable();
            $table->string('sentiments')->nullable();
            $table->string('attachments')->nullable();
            $table->string('date')->nullable();
            $table->string('email_address')->nullable();
            $table->string('client_code')->nullable();
            $table->string('price')->nullable();
            $table->string('color')->nullable();
            $table->text('project_tag')->nullable();
            $table->foreignId('assign_order_to_designer')->nullable()->constrained('users');
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
        Schema::dropIfExists('email_responses');
    }
}
