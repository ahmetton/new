<?php
// قالب الدورة المفردة — single-wpedu_course.php
// يُظهر الدروس، وصف الدورة، حالة التقدم، زر التسجيل، وزر تنزيل الشهادة إن صدرت.
get_header();
global $post;
$course_id   = get_the_ID();
$price       = get_post_meta( $course_id, '_wpedu_price', true );
$teacher_id  = get_post_field( 'post_author', $course_id );

// جلب دروس الدورة (IDs) مرتبة
$lessons_query = new WP_Query( array(
    'post_type'      => 'wpedu_lesson',
    'meta_key'       => '_course_id',
    'meta_value'     => $course_id,
    'posts_per_page' => -1,
    'orderby'        => 'menu_order',
    'order'          => 'ASC',
    'fields'         => 'ids',
) );

$lesson_ids     = $lessons_query->posts ?: array();
$total_lessons  = count( $lesson_ids );

// حالة المستخدم: تسجيل، تقدم، شهادة
$enrolled = false;
$progress_count = 0;
$certificate_issued = false;
$first_lesson_id = $lesson_ids ? intval( $lesson_ids[0] ) : 0;

if ( is_user_logged_in() ) {
    $user_id = get_current_user_id();
    $enrolled_courses = get_user_meta( $user_id, 'wpedu_enrolled_courses', true ) ?: array();
    $enrolled = in_array( $course_id, $enrolled_courses, true );

    $progress = get_user_meta( $user_id, 'wpedu_course_progress', true );
    if ( ! is_array( $progress ) ) { $progress = array(); }
    if ( isset( $progress[ $course_id ] ) && is_array( $progress[ $course_id ] ) ) {
        $progress_count = count( $progress[ $course_id ] );
    }

    $cert_meta_key = 'wpedu_cert_issued_' . intval( $course_id );
    $certificate_issued = (bool) get_user_meta( $user_id, $cert_meta_key, true );
}

$progress_percent = 0;
if ( $total_lessons > 0 ) {
    $progress_percent = intval( ( $progress_count / $total_lessons ) * 100 );
}
?>
<article class="course-single">
    <h1><?php the_title(); ?></h1>

    <div style="display:flex;gap:20px;align-items:flex-start;flex-wrap:wrap;">
        <div style="flex:2; min-width:280px;">
            <div class="course-content">
                <?php the_content(); ?>
            </div>

            <div style="margin-top:18px;">
                <h3>الدروس (<?php echo intval( $total_lessons ); ?>)</h3>

                <?php if ( $total_lessons > 0 ) : ?>
                    <div style="margin:8px 0;">
                        <div class="progress-bar" aria-hidden="true" style="width:100%;background:rgba(0,0,0,0.06);height:12px;border-radius:6px;overflow:hidden;">
                            <span style="display:block;height:100%;background:linear-gradient(90deg,var(--primary,#0a6ebd),#3aa0e6);width:<?php echo esc_attr( $progress_percent ); ?>%;"></span>
                        </div>
                        <div style="margin-top:8px;color:#666;font-size:14px;">
                            التقدم: <?php echo intval( $progress_count ); ?> / <?php echo intval( $total_lessons ); ?> &nbsp; (<?php echo esc_html( $progress_percent ); ?>%)
                        </div>
                    </div>

                    <ul class="lesson-list" style="margin-top:12px;">
                        <?php
                        if ( $lesson_ids ) {
                            foreach ( $lesson_ids as $lid ) {
                                $lid = intval( $lid );
                                $title = get_the_title( $lid );
                                $permalink = get_permalink( $lid );
                                $is_complete = false;
                                if ( is_user_logged_in() ) {
                                    $user_progress = get_user_meta( get_current_user_id(), 'wpedu_course_progress', true ) ?: array();
                                    if ( isset( $user_progress[ $course_id ] ) && is_array( $user_progress[ $course_id ] ) ) {
                                        $is_complete = in_array( $lid, $user_progress[ $course_id ], true );
                                    }
                                }
                                echo '<li style="padding:8px 6px;border-bottom:1px dashed rgba(0,0,0,0.04);display:flex;justify-content:space-between;align-items:center;">';
                                echo '<a href="'. esc_url( $permalink ) .'">'. esc_html( $title ) .'</a>';
                                if ( $is_complete ) {
                                    echo '<span style="color:var(--success,#28a745);font-size:13px;">مكتمل</span>';
                                }
                                echo '</li>';
                            }
                        }
                        ?>
                    </ul>
                <?php else : ?>
                    <p>لا توجد دروس بعد لهذه الدورة.</p>
                <?php endif; ?>
            </div>
        </div>

        <aside style="flex:1; min-width:260px;">
            <div style="background:#fff;border:1px solid #eee;padding:12px;border-radius:6px;">
                <p>المدرّس: <?php echo esc_html( get_the_author_meta( 'display_name', $teacher_id ) ); ?></p>
                <p>السعر: <?php echo $price ? esc_html( $price ) . ' ر.س' : 'مجاني'; ?></p>

                <?php if ( is_user_logged_in() ): ?>
                    <?php if ( $enrolled ): ?>

                        <?php if ( $first_lesson_id ): ?>
                            <a class="btn" href="<?php echo esc_url( get_permalink( $first_lesson_id ) ); ?>">ابدأ الدورة</a>
                            <br><br>
                        <?php else: ?>
                            <a class="btn" href="<?php echo esc_url( add_query_arg( array( 'lms_action' => 'enter_course', 'course_id' => $course_id ) ) ); ?>">ادخل إلى الدورة</a>
                            <br><br>
                        <?php endif; ?>

                        <?php if ( $certificate_issued ): ?>
                            <a class="btn btn-outline" href="<?php echo esc_url( add_query_arg( array( 'lms_action' => 'download_certificate', 'course_id' => $course_id ) ) ); ?>">تحميل الشهادة (PDF)</a>
                        <?php else: ?>
                            <div style="margin-top:8px;color:#666;font-size:13px;">
                                <?php if ( $progress_count === $total_lessons && $total_lessons > 0 ) : ?>
                                    <span>جارٍ إصدار الشهادة تلقائيًا... يمكنك إعادة تحميل الصفحة أو التحقق من لوحة الشهادات.</span>
                                <?php else : ?>
                                    <span>ستصدر الشهادة تلقائيًا عند اكتمال جميع الدروس.</span>
                                <?php endif; ?>
                            </div>
                        <?php endif; ?>

                    <?php else: // غير مسجل ?>
                        <form method="post" action="<?php echo esc_url( admin_url( 'admin-ajax.php' ) ); ?>">
                            <?php wp_nonce_field( 'wpedu_enroll_' . $course_id, 'wpedu_enroll_nonce' ); ?>
                            <input type="hidden" name="action" value="wpedu_enroll">
                            <input type="hidden" name="course_id" value="<?php echo esc_attr( $course_id ); ?>">
                            <button class="btn" type="submit"><?php echo $price ? 'سجل بالدورة (مدفوع)' : 'سجل مجاناً'; ?></button>
                        </form>
                    <?php endif; ?>
                <?php else: // غير مسجل دخول ?>
                    <a class="btn" href="<?php echo wp_login_url( get_permalink() ); ?>">تسجيل / دخول</a>
                <?php endif; ?>

                <div style="margin-top:12px;color:#999;font-size:13px;">
                    <?php echo intval( get_post_meta( $course_id, '_students_count', true ) ) ?: 0; ?> طالب مسجل
                </div>
            </div>
        </aside>
    </div>
</article>

<?php get_footer(); ?>