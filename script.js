var sid = null;
var uid = null;
var cid = null;
var data = null;
var trigeranimation = true;

var likecount = 0;

function bannerClick(){
    getItem((d) => {
        setItem(d, () => {
            if ($j(".s4l").length <= 0) {
                $j('body').append(popupHtml);
            }
            $j('.s4l__back__icon').hide();
            $j('.s4l__main__page .banner').hide();
            $j('.s4l-overlay').show();
            $j('.s4l__main__page').show();
            $j('.s4l__cards').hide();
            $j('.s4l__result__page').hide();
            $j('#header').hide();
            $j('body').css('overflow', 'hidden');
            hideloader();
        });
    });
}
bb.waitForElements('.s4l__close__icon', function (icon) {
    $j(icon).click(function () {
        $j('.s4l-overlay').hide();
        $j('.s4l__main__page').hide();
        $j('.s4l__cards').show();
        $j('#header').show();
        $j('body').css('overflow', 'auto');
    });
});
bb.waitForElements('.s4l__back__icon', function (icon) {
    $j(icon).click(function () {
        $j('.s4l__result__page').hide();
        $j('.s4l__end__page').show();
        $j('.s4l__back__icon').hide();
    });
});
bb.waitForElements('.s4l-btn-proceed', function (proceed) {
    $j(proceed).click(function () {
        if (data !== null) {
            setItem(data, () => {
                $j('.s4l__main__page').hide();
                $j('.s4l__cards').show();
                hideloader();
            });
        }
    });
});
bb.waitForElements('#s4l__card__btm__details__link', function (details) {
    $j(details).click(function () {
        $j('.s4l__card__btm').addClass('details__show');
        $j('#s4l__btn_dislike, #s4l__btn_like').hide();
        $j('#s4l__card__btm__details__link').hide(200);
        $j('#s4l__card__btm__price__box').show(200);
        $j('#s4l__card__btm__details__btn').show(200);
        $j('#s4l__btn_hide_details').show(200);
    });
});
$j(document).ready(function () {
    $j('.col-main').prepend(bannerHtml);
    
    //swipe animation
    var animating = false;
    var cardsCounter = 0;
    var numOfCards = 6;
    var decisionVal = 80;
    var pullDeltaX = 0;
    var deg = 0;
    var $card, $cardReject, $cardLike;
    
    function pullChange() {
        animating = true;
        deg = pullDeltaX / 10;
        $card.css("transform", "translateX(" + pullDeltaX + "px) rotate(" + deg + "deg)");
        
        var opacity = pullDeltaX / 100;
        var rejectOpacity = (opacity >= 0) ? 0 : Math.abs(opacity);
        var likeOpacity = (opacity <= 0) ? 0 : opacity;
        $cardReject.css("opacity", rejectOpacity);
        $cardLike.css("opacity", likeOpacity);
    };
    
    function release() {
        if (pullDeltaX >= decisionVal) {
            $card.addClass("to-right");
        } else if (pullDeltaX <= -decisionVal) {
            $card.addClass("to-left");
        }
        
        if (Math.abs(pullDeltaX) >= decisionVal) {
            $card.addClass("inactive");
            
            setTimeout(function () {
                $card.addClass("below").removeClass("inactive to-left to-right");
                cardsCounter++;
                if (cardsCounter === numOfCards) {
                    cardsCounter = 0;
                    $j(".s4l__card").removeClass("below");
                }
            }, 300);
        }
        
        if (Math.abs(pullDeltaX) < decisionVal) {
            $card.addClass("reset");
        }
        
        setTimeout(function () {
            $card.attr("style", "").removeClass("reset")
            .find(".s4l__card__choice").attr("style", "");
            
            pullDeltaX = 0;
            animating = false;
        }, 300);
    };
    
    $j(document).on('click', '.s4l__btn', function (e) {
        var elemClass = $j(this).attr('class');
        $card = $j(this).parent().parent().parent();
        if (elemClass.indexOf('dislike') > 0) {
            dislike();
        }
        else if(elemClass.indexOf('like') > 0){
            like();
        }
        else{
            hideDetails();
        }
    });
    $j(document).on('click', '#weiter_swipen', function (e) {
        likecount = 0;
        $j('.s4l__end__page').hide();
        getItem((d)=>{
            setItem(d, () => {
                $j('.s4l__cards').show(); 
                hideloader();
            });                    
        });
    });
    $j(document).on('click', '#s4l__result__btn', function (e) {
        likecount = 0;
        $j('.s4l__end__page').hide();
        $j('.s4l__cards').hide();
        $j('.s4l__result__page').show();
        $j('.s4l__content .banner').hide();
        $j('.s4l__back__icon').show();
        getResults();
    });
    $j(document).on('click', '.s4l_result-tab', function(e) {
        var tabsBox = $j('.s4l_result-tab-box');
        var tabsContent = tabsBox.find('.s4l_result-tabs-content');
        
        tabsContent.find('.s4l_tab-content').hide();
        var tabId = $j(this).data('tabid');
        
        $j(this).closest('ul').find('.active').removeClass('active');
        $j(this).addClass('active');
        
        $j(`#${tabId}`).show();
        
        //getResults();
    });
    $j(document).on('click', '.s4l_result-tab', function(e) {
    });
    function hideDetails(){
        $j('.s4l__card__btm').removeClass('details__show');
        $j('#s4l__btn_dislike, #s4l__btn_like').show(200);
        $j('#s4l__card__btm__details__link').show(200);
        $j('#s4l__card__btm__price__box').hide(200);
        $j('#s4l__card__btm__details__btn').hide(200);
        $j('#s4l__btn_hide_details').hide(200);
    }
    bb.waitForElements('#s4l__card__btm__details__btn', function (details) {
        $j(details).click(function () {
            hideDetails();
        });
    });
    function like() {
        likecount++;
        
        likedislikehttprequest(61, () => {
            if (likecount < 8) {
                getItem((d) => {
                    setItem(d, () => {
                        hideloader();
                    });
                    if (trigeranimation) {
                        pullDeltaX = 81;
                        release();
                    }
                });
            }
            else {
                $j('.s4l__cards').hide();
                $j('.s4l__end__page').show();
            }
        });
    }
    function dislike() {
        likedislikehttprequest(62, () => {
            getItem((d) => {
                setItem(d, () => {
                    hideloader();
                });
                if (trigeranimation) {
                    pullDeltaX = -81;
                    release();
                }
            })
        });
    }
});
function getResults(){
    sid = Cookies.get("prudsysSession");
    uid = Cookies.get("prudsysUser");
    if (typeof uid === 'undefined' || uid === null) {
        uid = sid;
    }
    if (sid && uid) {
        getEmf();
        getAuswahl();
    }
}
function getEmf(){
    var url = `https://lampenwelt.prudsys-rde.de/rde_server/res/lampenweltDE/plugins/exec/prudsys/prudsys/core/recommendation/swipe?sid=${sid}&userid=${uid}&tracking=true`;
    $j.get(url, (d) => {
        content = d["recommendations"]["area-similarWishlist"]["content"];
        
        var html = '';
        for (const item of content) {
            var data = item['data'];
            var rating = (parseFloat(data['param16']) / 5) * 100;
            if(data['brand']=='-'){
                console.log('empty brand');
            }
            html += `
            <li>
                <a href="${data['URL']}">
                    <div class="s4l_product-img">
                        <img src="${data['imageURL']}">  
                    </div>
                    <div class="s4l_product-info">
                        <p class="s4l_brand-name">
                            <span>${data['brand'] == '-' ? "&nbsp;" : data['brand']}</span>
                        </p>
                        <p class="s4l_product-name">
                            <span>${data['name']}</span>
                        </p>
                        <div class="rating-box ">
                            <svg class="icon icon-star"><use xlink:href="https://www.lampenwelt.de/skin/frontend/lw/default/images/sprite.svg#icon-star"></use></svg>
                            <svg class="icon icon-star"><use xlink:href="https://www.lampenwelt.de/skin/frontend/lw/default/images/sprite.svg#icon-star"></use></svg>
                            <svg class="icon icon-star"><use xlink:href="https://www.lampenwelt.de/skin/frontend/lw/default/images/sprite.svg#icon-star"></use></svg>
                            <svg class="icon icon-star"><use xlink:href="https://www.lampenwelt.de/skin/frontend/lw/default/images/sprite.svg#icon-star"></use></svg>
                            <svg class="icon icon-star"><use xlink:href="https://www.lampenwelt.de/skin/frontend/lw/default/images/sprite.svg#icon-star"></use></svg>
                            <div class="rating" style="width:`+ rating +`%">
                                <svg class="icon icon-star"><use xlink:href="https://www.lampenwelt.de/skin/frontend/lw/default/images/sprite.svg#icon-star"></use></svg>
                                <svg class="icon icon-star"><use xlink:href="https://www.lampenwelt.de/skin/frontend/lw/default/images/sprite.svg#icon-star"></use></svg>
                                <svg class="icon icon-star"><use xlink:href="https://www.lampenwelt.de/skin/frontend/lw/default/images/sprite.svg#icon-star"></use></svg>
                                <svg class="icon icon-star"><use xlink:href="https://www.lampenwelt.de/skin/frontend/lw/default/images/sprite.svg#icon-star"></use></svg>
                                <svg class="icon icon-star"><use xlink:href="https://www.lampenwelt.de/skin/frontend/lw/default/images/sprite.svg#icon-star"></use></svg>
                            </div>
                        </div>
                        ${data['quantityUnit']}
                        ${data['param13']}
                    </div>
                </a>
            </li>
            `;
        }
        
        $j('#s4l_result-tab-1 > ul').html(html);
    });
}
function getAuswahl(){
    var url = `https://lampenwelt.prudsys-rde.de/rde_server/res/lampenweltDE/plugins/exec/prudsys/prudsys/core/recommendation/swipe?sid=${sid}&userid=${uid}&tracking=true`;
    $j.get(url, (d) => {
        content = d["recommendations"]["area-wishlist"]["content"];
        
        var html = '';
        for (const item of content) {
            var data = item['data'];
            var rating = (parseFloat(data['param16']) / 5) * 100;
            if(data['brand']=='-'){
                console.log('empty brand');
            }
            html += `
            <li>
                <a href="${data['URL']}">
                    <div class="s4l_product-img">
                        <img src="${data['imageURL']}">  
                    </div>
                    <div class="s4l_product-info">
                        <p class="s4l_brand-name">
                            <span>${data['brand'] == '-' ? "&nbsp;" : data['brand']}</span>
                        </p>
                        <p class="s4l_product-name">
                        <span>${data['name']}</span>
                        </p>
                        <div class="rating-box ">
                            <svg class="icon icon-star"><use xlink:href="https://www.lampenwelt.de/skin/frontend/lw/default/images/sprite.svg#icon-star"></use></svg>
                            <svg class="icon icon-star"><use xlink:href="https://www.lampenwelt.de/skin/frontend/lw/default/images/sprite.svg#icon-star"></use></svg>
                            <svg class="icon icon-star"><use xlink:href="https://www.lampenwelt.de/skin/frontend/lw/default/images/sprite.svg#icon-star"></use></svg>
                            <svg class="icon icon-star"><use xlink:href="https://www.lampenwelt.de/skin/frontend/lw/default/images/sprite.svg#icon-star"></use></svg>
                            <svg class="icon icon-star"><use xlink:href="https://www.lampenwelt.de/skin/frontend/lw/default/images/sprite.svg#icon-star"></use></svg>
                            <div class="rating" style="width:`+ rating +`%">
                                <svg class="icon icon-star"><use xlink:href="https://www.lampenwelt.de/skin/frontend/lw/default/images/sprite.svg#icon-star"></use></svg>
                                <svg class="icon icon-star"><use xlink:href="https://www.lampenwelt.de/skin/frontend/lw/default/images/sprite.svg#icon-star"></use></svg>
                                <svg class="icon icon-star"><use xlink:href="https://www.lampenwelt.de/skin/frontend/lw/default/images/sprite.svg#icon-star"></use></svg>
                                <svg class="icon icon-star"><use xlink:href="https://www.lampenwelt.de/skin/frontend/lw/default/images/sprite.svg#icon-star"></use></svg>
                                <svg class="icon icon-star"><use xlink:href="https://www.lampenwelt.de/skin/frontend/lw/default/images/sprite.svg#icon-star"></use></svg>
                            </div>
                        </div>
                        ${data['quantityUnit']}
                        ${data['param13']}
                    </div>
                </a>
            </li>
            `;
        }
        
        $j('#s4l_result-tab-2 > ul').html(html);
    });
}
function likedislikehttprequest(eventid, callback) {
    var artid = $j('#s4l__btn_like').data('uid');
    var url = `https://lampenwelt.prudsys-rde.de/rde_server/res/lampenweltDE/plugins/exec/prudsys/prudsys/event/customevent?sid=${sid}&id=${artid}&type=${eventid}&userid=${uid}&tracking=true`;
    $j.get(url, (data) => {
        callback();
    });
}
let testArra = [];
function getItem(callback) {
    var scripts = $j('script[src*="cid"]');
    if(scripts.length > 0){
        var sc = $j(scripts[0]).attr('src');
        if(typeof sc !== 'undefined'){
            cid = sc.split('cid=')[1];
            if(cid.indexOf('de') < 0)
                cid += "-de";
            console.log('cid=',cid);
        }
    }


    sid = Cookies.get("prudsysSession");
    uid = Cookies.get("prudsysUser");
    if (typeof uid === 'undefined' || uid === null) {
        uid = sid;
    }
    var url = `https://lampenwelt.prudsys-rde.de/rde_server/res/lampenweltDE/plugins/exec/prudsys/prudsys/core/recommendation/swipe?sid=${sid}&userid=${uid}&tracking=true` + (cid != null ? `&cid=${cid}` : ``);
    if (sid !== null && uid !== null) {
        $j.get(url, (d) => {
            data = d["recommendations"]["area-swipe"]["content"][0]["data"];
            var _uid = data["UID"];
            var duplicated = testArra.filter((v, i) => {
                return v == _uid;
            });
            if (typeof duplicated !== 'undefined' && duplicated.length > 0)
                console.log("duplicated: ", duplicated);
            else {
                testArra.push(_uid);
            }
            callback(d["recommendations"]["area-swipe"]["content"][0]["data"]);
        });
    }
}
function setItem(d, callback) {
    if (typeof d !== 'undefined' && d !== null) {
        showloader();
        $j('#s4l__card__image').attr('src', d["imageURL"]);
        var brand = d['brand'] == '-' ? "&nbsp;" : d['brand'];
        $j('#s4l__card__btm__brand_text').html(brand);
        $j('#s4l__card__btm__desc_text').html(d["name"]);
        $j('#s4l__card__btm__spec_price').html(d["reward"]);
        $j('#s4l__card__btm__old_price').html(d["strikeOutPrice"]);
        $j('#s4l__btn_dislike').data('uid', d["UID"]);
        $j('#s4l__btn_like').data('uid', d["UID"]);
    }
    callback();
}
function showloader(){
    $j('#s4l__loader').show();
}
function hideloader(){
    $j('#s4l__loader').hide();
}