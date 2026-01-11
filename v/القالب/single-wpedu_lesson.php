<?php
// ملف القالب: wp-edu-theme/single-wpedu_lesson.php
// قالب الدرس المفرد - يعرض الدرس، اسم المدرّس، زر العودة إلى الدورة، زر الانضمام للحصة، وزر وسم الدرس كمكتمل.
get_header();
global $post;
$lesson_id = get_the_ID();
$course_id = get_post_meta( $lesson_id, '_course_id', true );
$teacher_id = get_post_field( 'post_author', $lesson_id );
$jitsi_room = get_post_meta( $lesson_id, '_wpedu_jitsi_room', true );

// جلب اسم المدرّس وعرضه كرابط لصفحة الكاتب
$teacher_name = '';
$teacher_link = '';
if ( $teacher_id ) {
    $teacher_name = get_the_author_meta( 'display_name', $teacher_id );
    $teacher_link = get_author_posts_url( $teacher_id );
}

$user_enrolled = false;
if ( is_user_logged_in() ) {
    $user_id = get_current_user_id();
    $enrolled = get_user_meta( $user_id, 'wpedu_enrolled_courses', true ) ?: array();
    $user_enrolled = in_array( intval( $course_id ), $enrolled, true );
}
?>
<article class="lesson-single">
    <h1><?php the_title(); ?></h1>

    <p style="color:#666;">
        تابع للدورة:
        <?php if ( $course_id ): ?>
            <a href="<?php echo esc_url( get_permalink( $course_id ) ); ?>"><?php echo esc_html( get_the_title( $course_id ) ); ?></a>
        <?php else: ?>
            <span style="color:#999;">غير مرتبط بدورة</span>
        <?php endif; ?>
    </p>

    <?php if ( $teacher_name ): ?>
        <p style="color:#666;">المدرّس: <a href="<?php echo esc_url( $teacher_link ); ?>"><?php echo esc_html( $teacher_name ); ?></a></p>
    <?php endif; ?>

    <div class="lesson-content">
        <?php the_content(); ?>
    </div>

    <div style="margin-top:18px;display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
        <div>
            <a class="btn btn-outline" href="<?php echo esc_url( get_permalink( $course_id ) ); ?>">العودة إلى قائمة الدروس</a>
        </div>

        <div>
            <?php if ( is_user_logged_in() ): ?>
                <?php if ( $user_enrolled || current_user_can( 'edit_posts' ) ): ?>
                    <?php if ( $jitsi_room ): ?>
                        <a class="btn" href="<?php echo esc_url( add_query_arg( array( 'lms_action' => 'join_jitsi', 'lesson_id' => $lesson_id ) ) ); ?>">انضم للحصة المباشرة</a>
                        <span style="margin-left:8px;font-size:13px;color:#666;">(يُفتح داخل الموقع أو نافذة جديدة)</span>
                    <?php endif; ?>

                    <div style="margin-top:12px;">
                        <button id="wpedu-mark-complete" class="btn btn-outline" data-lesson="<?php echo esc_attr( $lesson_id ); ?>">وَسِم هذا الدرس كمكتمل</button>
                        <span id="wpedu-progress-msg" style="margin-right:10px;"></span>
                    </div>

                <?php else: ?>
                    <p>لتتمكن من الانضمام للمحاضرة أو وسم الدرس كمكتمل، اشترك أولاً في الدورة.</p>
                <?php endif; ?>
            <?php else: ?>
                <a class="btn" href="<?php echo wp_login_url( get_permalink() ); ?>">تسجيل / دخول</a>
            <?php endif; ?>
        </div>
    </div>
</article>

<script>
jQuery(function($){
    $(document).on('click','#wpedu-mark-complete', function(e){
        e.preventDefault();
        var $btn = $(this);
        var lesson_id = $btn.data('lesson');
        $.post('<?php echo esc_js( admin_url( 'admin-ajax.php' ) ); ?>', { action: 'wpedu_mark_lesson_complete', lesson_id: lesson_id }, function(res){
            if ( res.success ) {
                $('#wpedu-progress-msg').text('تم وسم الدرس كمكتمل — ' + res.data.progress_count + '/' + res.data.total_lessons);
                if ( res.data.course_completed ) {
                    var msg = ' — لقد أكملت الدورة! صدرت شهادة لك.';
                    if ( res.data.certificate_number ) msg += ' رقم الشهادة: ' + res.data.certificate_number;
                    $('#wpedu-progress-msg').append( msg );
                }
            } else {
                alert(res.data || 'حدث خطأ');
            }
        }, 'json');
    });
});
</script>

<?php get_footer(); ?>