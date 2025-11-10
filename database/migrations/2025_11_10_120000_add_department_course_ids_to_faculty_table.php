<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDepartmentCourseIdsToFacultyTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('faculty', function (Blueprint $table) {
            if (!Schema::hasColumn('faculty', 'department_id')) {
                $table->unsignedBigInteger('department_id')->nullable()->after('department');
            }
            if (!Schema::hasColumn('faculty', 'course_id')) {
                $table->unsignedBigInteger('course_id')->nullable()->after('department_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('faculty', function (Blueprint $table) {
            if (Schema::hasColumn('faculty', 'course_id')) {
                $table->dropColumn('course_id');
            }
            if (Schema::hasColumn('faculty', 'department_id')) {
                $table->dropColumn('department_id');
            }
        });
    }
}
