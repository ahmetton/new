<?php
// قالب بطاقة دورة يستخدم داخل الأرشيف/الصفحة الرئيسية
global $post;
$course_id = get_the_ID();
$price = get_post_meta($course_id,'_wpedu_price',true);
$thumbnail = has_post_thumbnail() ? get_the_post_thumbnail_url($course_id,'course-thumb') : get_template_directory_uri().'/assets/images/course-placeholder.jpg';
?>
<div class="course-card">
    <img src="<?php echo esc_url($thumbnail); ?>" alt="<?php the_title_attribute(); ?>">
    <h3 style="margin:10px 0;"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
    <div class="course-meta">
        <span><?php echo esc_html( $price ? $price.' ر.س' : 'مجاني' ); ?></span>
        <span><?php echo get_post_meta($course_id,'_students_count',true) ?: '0'; ?> طالب</span>
    </div>
    <div style="margin-top:10px;">
        <a class="btn" href="<?php the_permalink(); ?>">عرض الدورة</a>
    </div>
</div>