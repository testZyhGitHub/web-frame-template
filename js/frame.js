/**
 * Created by 004928 on 2017/8/16.
 */
(function () {

    var data = [
        {
            icon:'icon-sk001',
            id:'001',
            title:'首页',
            path:'home.html',
            children:[]
        },
        {
            icon:'icon-sk002',
            title:'报表',
            id:'002',
            path:'',
            children:[
                {id:'003',icon:'',title:'岗位管理',children:[
                    {
                        icon:'icon-sk001',
                        id:'003',
                        title:'首11111页',
                        path:'page1.html',
                        children:[]
                    }
                ]},
                {id:'004',icon:'',title:'规定管理',path:'page2.html',children:[]},
                {id:'005',icon:'',title:'术语管理',path:'page3.html',children:[]},
                {id:'006',icon:'',title:'程序管理',path:'page1.html',children:[]},
                {id:'007',icon:'',title:'附件管理',path:'page2.html',children:[]},
                {id:'008',icon:'',title:'作废审批',path:'page3.html',children:[]},
                {id:'009',icon:'',title:'岗位说明书管理',path:'page1.html',children:[]}
            ]
        },
        {
            id:'010',
            icon:'icon-sk003',
            title:'数据中心管理',
            path:'',
            children:[
                {id:'011',icon:'',title:'资源管理',path:'',children:[]},
                {id:'012',icon:'',title:'角色管理',path:'',children:[]},
                {id:'013',icon:'',title:'用户管理',path:'',children:[]},
                {id:'014',icon:'',title:'组织机构',path:'',children:[]}
            ]
        },
        {
            id:'015',
            icon:'icon-sk004',
            title:'权限管理',
            path:'',
            children:[
                {id:'016',icon:'',title:'资源管理',path:'',children:[]},
                {id:'017',icon:'',title:'角色管理',path:'',children:[]},
                {id:'018',icon:'',title:'用户管理',path:'',children:[]},
                {id:'019',icon:'',title:'组织机构',path:'',children:[]}
            ]
        },
        {
            id:'020',
            icon:'icon-sk005',
            title:'基础数据维护',
            path:'',
            children:[
                {id:'021',icon:'',title:'数据字典管理',path:'',children:[]}
            ]
        },
        {
            id:'022',
            icon:'icon-sk006',
            title:'系统管理',
            path:'',
            children:[
                {id:'023',icon:'',title:'SD图管理',path:'',children:[]},
                {id:'024',icon:'',title:'SD图审核及记录',path:'',children:[]},
                {id:'025',icon:'',title:'SD图延迟预警',path:'',children:[]},
                {id:'026',icon:'',title:'SD图操作日志',path:'',children:[]}
            ]
        },
        {
            id:'023',
            icon:'icon-sk007',
            title:'监控',
            path:'',
            children:[
                {id:'024',icon:'',title:'SD图管理',path:'',children:[]},
                {id:'025',icon:'',title:'SD图审核及记录',path:'',children:[]},
                {id:'026',icon:'',title:'SD图延迟预警',path:'',children:[]},
                {id:'027',icon:'',title:'SD图操作日志',path:'',children:[]}
            ]
        }
    ];
    // 每个菜单id对应的单个数据，children.length == 0 的数据
    var idMapData = {};
    // Tab 标签id的集合
    var tabList = [];
    // 当前点击活动的Tab
    var currTab = null ;
    // 当前活动的Page
    var currPage = null ;
    /**
     * 左侧菜单栏展开关闭事件
     */
    window.leftMenuToggleEvent = function (e) {
        toggleMenu();
        $(e.currentTarget).toggleClass('open' , '');
        // PS:这里做的是特殊处理，因为首页展示很多报表，但是要求每行展示5个，这就需要
        // 每个报表的margin根据iframe的宽高自适应，所以这里特别调用一下首页中的
        // loopExecuteByCount 方法，进行动态调整margin （！！！特殊情况才添加如此下代码）
        var home = document.getElementById("iframe001");
        if(home) {
            if(!$(home).hasClass('hide')) {
                home.contentWindow.loopExecuteByCount(10 , 50);
            }
        }
    }

    /**
     * 初始化菜单
     */
    function initMenu () {
        loopCreateMenu($(".first") , data);
        $(".first li").click(onMenuItemClick);
    }

    /**
     * 递归创建菜单
     */
    function loopCreateMenu (parent ,  menuData) {
        for(var i = 0 ; i < menuData.length ; i ++) {
            var menu = menuData[i];
            parent.append(createMenuItem(menu));
            if(menu.children.length > 0) {
                var $childMenuBox = $("<ul class='menu hide inner-menu'></ul>");
                parent.append($childMenuBox);
                arguments.callee($childMenuBox , menu.children);
            }
        }
    }

    function createMenuItem (menu) {
        if(menu.children.length == 0)  idMapData[menu.id] = menu ;
        var arrowCls = menu.children.length > 0 ? '' : 'hide';
        return "<li menu-id='"+menu.id+"'>"+
            "<i class='"+menu.icon+" menu-icon'></i>"+
            "<a>"+menu.title+"</a>"+
            "<i class='menu-arrow icon-sk027 "+arrowCls+"'></i>"+
            "</li>";
    }

    /**
     * 响应菜单项的点击事件
     */
    function onMenuItemClick (ev) {
        if($(ev.currentTarget).next().is('ul')) {
            $(ev.currentTarget).next().slideToggle(300);
            if(!$(ev.currentTarget).find(".menu-arrow").hasClass("hide")) {
                $(ev.currentTarget).find(".menu-arrow").toggleClass('icon-sk039','icon-sk027');
            }
        } else {
            excuteMenuEvent(ev);
        }
    }

    /**
     * 执行菜单事件
     */
    function excuteMenuEvent (ev) {
        var id = $(ev.currentTarget).attr("menu-id");
        addTab({
            id:idMapData[id].id,
            title:idMapData[id].title,
            path:idMapData[id].path
        });
    }

    function addTab (tab) {
        if(tabList.indexOf(tab.id) == -1) {
            if(currTab != null) $(currTab).removeClass('open');
            $(".tab-container").width($(".tab-container").width() + 135);
            var $tab = $(createTab(tab));
            $tab.find("i").click(onTabClose);
            $tab.click(onTabClick);
            $(".tab-container").append($tab);
            tabList.push(tab.id);
            currTab = $tab[0] ;
            createTabPage(tab.id , tab.path);
        }
    }

    function createTab (tab) {
        var tab = "<div class='tab open' tab-id='"+tab.id+"'>"+
            "<span>"+tab.title+"</span>"+
            "<i class='icon-sk021 tab-close'></i>"+
            "</div>" ;
        return tab ;
    }

    /**
     * 创建新的页面
     * @param path
     */
    function createTabPage (id , path) {
        var page = $("<iframe class='myframe' id='iframe"+id+"' name='iframe' border='0' frameborder='0' src='"+path+"'></iframe>");
        if(currPage != null) {
            currPage.addClass('hide');
        }
        $(".container").append(page);
        page.removeClass('hide');
        currPage = page ;
    }

    /**
     * 响应Tab的点击事件
     * @param e
     */
    function onTabClick (e) {
        if(e.currentTarget != currTab) {
            $(e.currentTarget).addClass("open");
            $(currTab).removeClass('open');
            currTab = e.currentTarget ;
            var id = $(e.currentTarget).attr("tab-id");
            switchPage(id);
        }
    }

    /**
     * 根据id切换界面
     * @param id
     */
    function switchPage (id) {
        currPage.addClass('hide');
        currPage = $("#iframe"+id).removeClass('hide');
    }

    /**
     * 关闭页面
     * @param id
     * @param tab
     */
    function closePage (id , tab) {
        $(tab).closest(".tab").remove();
        $("#iframe"+id).remove();
    }

    /**
     * 关闭tab
     * 当前页面被关闭：
     *  1.默认显示左边第一个Tab
     *      如果没有，则显示右边第一个，否则走步骤2；
     *  2.没有其他界面，则显示空白
     */
    function onTabClose (e) {
        e.preventDefault();
        e.stopPropagation();

        var id = $(e.currentTarget).closest(".tab").attr("tab-id");
        var index = tabList.indexOf(id);
        if(index != -1) tabList.splice(index , 1);
        $(".tab-container").width($(".tab-container").width() - 135);
        var nextTab = $(e.currentTarget).closest(".tab").prev();
        if(nextTab.length == 0) {
            nextTab = $(e.currentTarget).closest(".tab").next();
        }

        // 当前只有一个被打开的页面
        if(nextTab.length == 0) {
            closePage(id , e.currentTarget);
            return ;
        }
        closePage(id , e.currentTarget);
        nextTab.trigger("click");
    }

    function toggleMenu () {
        toggleLeftMenu();
        toggleTopBar();
        reSetContainerSize();
    }

    /**
     * 展开/收缩左侧菜单
     */
    function toggleLeftMenu () {
        $(".left").toggleClass('slide-left-out' , '');
    }
    /**
     * 展开/收缩顶部导航
     */
    function toggleTopBar () {
        $(".top").toggleClass('slide-top-out' ,'');
    }
    /**
     * 重置内容区域宽高
     */
    function reSetContainerSize () {
        $(".container").toggleClass('zoom-container' ,'');
    }

    /**
     * 上一页
     */
    function onPrePage () {
        $(".tab-scroll").scrollLeft($(".tab-scroll").scrollLeft() - 135);
    }

    /**
     * 下一页
     */
    function onNextPage () {
        $(".tab-scroll").scrollLeft($(".tab-scroll").scrollLeft() + 135);
    }

    $(".tab-pre").click(onPrePage);
    $(".tab-next").click(onNextPage);

    initMenu();
    // 如需框架默认加载首页，则取消下面注释的代码
    // $(".left ul.first li").first().trigger("click");
})()