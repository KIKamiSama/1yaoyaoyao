require(['config'], function() {
    require(['jquery'], function() {
        ! function($) {
            // $(".item h3 .btn").click(function() {
            //     // $(this).addClass('current') //给当前元素添加"current"样式
            //     //     .find('.btn').addClass('down') //小箭头向下样式
            //     //     .parent().next().slideDown('slow', '') //下一个元素显示
            //     //     .parent().siblings().children('a').removeClass('current') //父元素的兄弟元素的子元素去除"current"样式
            //     //     .find('.btn').removeClass('down').parent().next().slideUp('slow', 'easeOutQuad'); //隐藏
            //     // return false; //阻止默认时间
            //     if ($(this).parent().next('ul').is(':hidden')) {
            //         $(this).parent().next('ul').slideDown(function() {
            //                 let ul = $(this).parent().next('ul');
            //                 ul.show();
            //                 // ul.siblings('ul').hide();
            //                 if (ul.siblings('ul').is(':visible')) {
            //                     ul.siblings('ul').hide()
            //                 }
            //             })
            //             // $(this).parent().next('ul').sibling('ul').slideUp(function() {
            //             //     $(this).parent().next('ul').sibling('ul').hide();
            //             // })
            //     } else {
            //         $(this).parent().next('ul').slideUp(function() {
            //             $(this).parent().next('ul').hide();
            //         })
            //     }
            // })
            let button = $('.item h3 .btn');
            let ul = $('.inner ul');
            button.click(function() {
                ul.slideUp(
                    function() {
                        ul.hide();
                    }
                );
                if ($(this).parent().next('ul').is(':hidden')) {
                    $(this).parent().next('ul').slideDown(
                        function() {
                            $(this).parent().next('ul').show()
                        }
                    )
                }
            })
        }(jQuery);
    })
})