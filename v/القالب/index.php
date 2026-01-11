<?php get_header(); ?>
<section>
    <h2>آخر الدورات</h2>
    <div class="course-grid">
    <?php
    $courses = new WP_Query(array('post_type'=>'wpedu_course','posts_per_page'=>9));
    if ( $courses->have_posts() ) :
        while ( $courses->have_posts() ) : $courses->the_post();
            wpedu_get_template_part('course-card');
        endwhile;
        wp_reset_postdata();
    else:
        echo '<p>لا توجد دورات حتى الآن.</p>';
    endif;
    ?>
    </div>
</section>
<?php get_footer(); ?>