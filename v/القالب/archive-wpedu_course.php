<?php
// قالب أرشيف الدورات — archive-wpedu_course.php
get_header();
?>
<section>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <h1>الدورات</h1>
        <?php if ( is_user_logged_in() ) : ?>
            <a class="btn" href="<?php echo esc_url( admin_url('post-new.php?post_type=wpedu_course') ); ?>">إضافة دورة جديدة</a>
        <?php endif; ?>
    </div>

    <div class="course-grid">
    <?php
    $courses = new WP_Query( array(
        'post_type' => 'wpedu_course',
        'posts_per_page' => 12,
    ) );

    if ( $courses->have_posts() ) :
        while ( $courses->have_posts() ) : $courses->the_post();
            // استخدم قالب البطاقة إن وُجد
            $course_id = get_the_ID();
            $price = get_post_meta( $course_id, '_wpedu_price', true );
            $thumbnail = has_post_thumbnail() ? get_the_post_thumbnail_url( $course_id, 'course-thumb' ) : get_template_directory_uri() . '/assets/images/course-placeholder.jpg';
            ?>
            <div class="course-card">
                <img src="<?php echo esc_url( $thumbnail ); ?>" alt="<?php the_title_attribute(); ?>">
                <h3 style="margin:10px 0;"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
                <div class="course-meta">
                    <span><?php echo esc_html( $price ? $price.' ر.س' : 'مجاني' ); ?></span>
                    <span><?php echo get_post_meta($course_id,'_students_count',true) ?: '0'; ?> طالب</span>
                </div>
                <div style="margin-top:10px;">
                    <a class="btn" href="<?php the_permalink(); ?>">عرض الدورة</a>
                </div>
            </div>
            <?php
        endwhile;
        wp_reset_postdata();
    else:
        echo '<p>لا توجد دورات حتى الآن.</p>';
    endif;
    ?>
    </div>
</section>
<?php get_footer(); ?>