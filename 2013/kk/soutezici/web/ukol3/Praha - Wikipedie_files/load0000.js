function isCompatible(){if(navigator.appVersion.indexOf('MSIE')!==-1&&parseFloat(navigator.appVersion.split('MSIE')[1])<6){return false;}return true;}var startUp=function(){mw.config=new mw.Map(true);mw.loader.addSource({"local":{"loadScript":"//bits.wikimedia.org/cs.wikipedia.org/load.php","apiScript":"/w/api.php"}});(function(name,version,dependencies,group,source){})("MediaWikiSupport.loader","20130304T183631Z",[],null,"local");(function(name,version,dependencies,group,source){(function(mw,$){$(function(event){var $selected=$(mw.config.get('EmbedPlayer.RewriteSelector'));if($selected.length){var inx=0;var checkSetDone=function(){if(inx<$selected.length){$selected.slice(inx,inx+1).embedPlayer(function(){setTimeout(function(){checkSetDone();},5);});}inx++;};checkSetDone();}});$.fn.embedPlayer=function(readyCallback){var playerSet=this;mw.log('jQuery.fn.embedPlayer :: '+$(this).length);var dependencySet=['mw.EmbedPlayer'];var rewriteElementCount=0;$(this).each(function(inx,
playerElement){var skinName='';$(playerElement).removeAttr('controls');if(!$.browser.mozilla){$(playerElement).parent().getAbsoluteOverlaySpinner().attr('id','loadingSpinner_'+$(playerElement).attr('id'));}$(mw).trigger('EmbedPlayerUpdateDependencies',[playerElement,dependencySet]);});dependencySet=$.uniqueArray(dependencySet);mediaWiki.loader.using(dependencySet,function(){window.gM=mw.jqueryMsg.getMessageFunction({});mw.processEmbedPlayers(playerSet,readyCallback);},function(e){throw new Error('Error loading EmbedPlayer dependency set: '+e.message);});};})(window.mediaWiki,window.jQuery);})("EmbedPlayer.loader","20130304T183728Z",[],null,"local");(function(name,version,dependencies,group,source){(function(mw,$){$(mw).bind('EmbedPlayerUpdateDependencies',function(event,playerElement,classRequest){if(mw.isTimedTextSupported(playerElement)){classRequest=$.merge(classRequest,['mw.TimedText']);}});$(mw).bind('EmbedPlayerNewPlayer',function(event,embedPlayer){if(mw.isTimedTextSupported(
embedPlayer)){embedPlayer.timedText=new mw.TimedText(embedPlayer);}});mw.isTimedTextSupported=function(embedPlayer){var mwprovider=embedPlayer['data-mwprovider']||$(embedPlayer).data('mwprovider');var showInterface=mw.config.get('TimedText.ShowInterface.'+mwprovider)||mw.config.get('TimedText.ShowInterface');if(showInterface=='always'){return true;}else if(showInterface=='off'){return false;}if($(embedPlayer).find('track').length!=0){return true;}else{return false;}};})(window.mediaWiki,window.jQuery);})("TimedText.loader","20130304T183729Z",[],null,"local");(function(name,version,dependencies,group,source){(function(mw,$){$(mw).bind('EmbedPlayerUpdateDependencies',function(event,embedPlayer,dependencySet){if($(embedPlayer).attr('data-mwtitle')){$.merge(dependencySet,['mw.MediaWikiPlayerSupport']);}});})(window.mediaWiki,jQuery);})("mw.MediaWikiPlayer.loader","20130304T183729Z",[],null,"local");mw.loader.register([["site","1361771874",[],"site"],["noscript","1347062400",[],"noscript"],
["startup","1364295840",[],"startup"],["filepage","1347062400"],["user.groups","1347062400",[],"user"],["user","1347062400",[],"user"],["user.cssprefs","1347062400",["mediawiki.user"],"private"],["user.options","1347062400",[],"private"],["user.tokens","1347062400",[],"private"],["mediawiki.language.data","1364295840",["mediawiki.language.init"]],["skins.chick","1362422004"],["skins.cologneblue","1362422004"],["skins.modern","1362422005"],["skins.monobook","1362422005"],["skins.nostalgia","1362422005"],["skins.simple","1362422005"],["skins.standard","1362422005"],["skins.vector","1362422005"],["jquery","1362422004"],["jquery.appear","1362422004"],["jquery.arrowSteps","1362422004"],["jquery.async","1362422004"],["jquery.autoEllipsis","1362422004",["jquery.highlightText"]],["jquery.badge","1362422004"],["jquery.byteLength","1362422004"],["jquery.byteLimit","1362422004",["jquery.byteLength"]],["jquery.checkboxShiftClick","1362422004"],["jquery.client","1362422004"],["jquery.color",
"1362422004",["jquery.colorUtil"]],["jquery.colorUtil","1362422004"],["jquery.cookie","1362422004"],["jquery.delayedBind","1362422004"],["jquery.expandableField","1362422004",["jquery.delayedBind"]],["jquery.farbtastic","1362422004",["jquery.colorUtil"]],["jquery.footHovzer","1362422004"],["jquery.form","1362422004"],["jquery.getAttrs","1362422004"],["jquery.hidpi","1362422004"],["jquery.highlightText","1362422004",["jquery.mwExtension"]],["jquery.hoverIntent","1362422004"],["jquery.json","1362422004"],["jquery.localize","1362422004"],["jquery.makeCollapsible","1364265904"],["jquery.mockjax","1362422004"],["jquery.mw-jump","1362422004"],["jquery.mwExtension","1362422004"],["jquery.placeholder","1362422004"],["jquery.qunit","1362422004"],["jquery.qunit.completenessTest","1362422004",["jquery.qunit"]],["jquery.spinner","1362422004"],["jquery.jStorage","1362422004",["jquery.json"]],["jquery.suggestions","1362422004",["jquery.autoEllipsis"]],["jquery.tabIndex","1362422004"],[
"jquery.tablesorter","1364266185",["jquery.mwExtension"]],["jquery.textSelection","1362422004",["jquery.client"]],["jquery.validate","1362422004"],["jquery.xmldom","1362422004"],["jquery.tipsy","1362422003"],["jquery.ui.core","1362422004",["jquery"],"jquery.ui"],["jquery.ui.widget","1362422003",[],"jquery.ui"],["jquery.ui.mouse","1362422003",["jquery.ui.widget"],"jquery.ui"],["jquery.ui.position","1362422003",[],"jquery.ui"],["jquery.ui.draggable","1362422003",["jquery.ui.core","jquery.ui.mouse","jquery.ui.widget"],"jquery.ui"],["jquery.ui.droppable","1362422003",["jquery.ui.core","jquery.ui.mouse","jquery.ui.widget","jquery.ui.draggable"],"jquery.ui"],["jquery.ui.resizable","1362422003",["jquery.ui.core","jquery.ui.widget","jquery.ui.mouse"],"jquery.ui"],["jquery.ui.selectable","1362422003",["jquery.ui.core","jquery.ui.widget","jquery.ui.mouse"],"jquery.ui"],["jquery.ui.sortable","1362422003",["jquery.ui.core","jquery.ui.widget","jquery.ui.mouse"],"jquery.ui"],["jquery.ui.accordion",
"1362422003",["jquery.ui.core","jquery.ui.widget"],"jquery.ui"],["jquery.ui.autocomplete","1362422003",["jquery.ui.core","jquery.ui.widget","jquery.ui.position"],"jquery.ui"],["jquery.ui.button","1362422004",["jquery.ui.core","jquery.ui.widget"],"jquery.ui"],["jquery.ui.datepicker","1362422003",["jquery.ui.core"],"jquery.ui"],["jquery.ui.dialog","1362422004",["jquery.ui.core","jquery.ui.widget","jquery.ui.button","jquery.ui.draggable","jquery.ui.mouse","jquery.ui.position","jquery.ui.resizable"],"jquery.ui"],["jquery.ui.progressbar","1362422003",["jquery.ui.core","jquery.ui.widget"],"jquery.ui"],["jquery.ui.slider","1362422003",["jquery.ui.core","jquery.ui.widget","jquery.ui.mouse"],"jquery.ui"],["jquery.ui.tabs","1362422003",["jquery.ui.core","jquery.ui.widget"],"jquery.ui"],["jquery.effects.core","1362422003",["jquery"],"jquery.ui"],["jquery.effects.blind","1362422003",["jquery.effects.core"],"jquery.ui"],["jquery.effects.bounce","1362422003",["jquery.effects.core"],"jquery.ui"],[
"jquery.effects.clip","1362422003",["jquery.effects.core"],"jquery.ui"],["jquery.effects.drop","1362422003",["jquery.effects.core"],"jquery.ui"],["jquery.effects.explode","1362422003",["jquery.effects.core"],"jquery.ui"],["jquery.effects.fade","1362422003",["jquery.effects.core"],"jquery.ui"],["jquery.effects.fold","1362422003",["jquery.effects.core"],"jquery.ui"],["jquery.effects.highlight","1362422003",["jquery.effects.core"],"jquery.ui"],["jquery.effects.pulsate","1362422003",["jquery.effects.core"],"jquery.ui"],["jquery.effects.scale","1362422003",["jquery.effects.core"],"jquery.ui"],["jquery.effects.shake","1362422003",["jquery.effects.core"],"jquery.ui"],["jquery.effects.slide","1362422003",["jquery.effects.core"],"jquery.ui"],["jquery.effects.transfer","1362422003",["jquery.effects.core"],"jquery.ui"],["mediawiki","1362422004"],["mediawiki.api","1362422004",["mediawiki.util"]],["mediawiki.api.category","1362422004",["mediawiki.api","mediawiki.Title"]],["mediawiki.api.edit",
"1362422004",["mediawiki.api","mediawiki.Title"]],["mediawiki.api.parse","1362422004",["mediawiki.api"]],["mediawiki.api.titleblacklist","1362422004",["mediawiki.api","mediawiki.Title"]],["mediawiki.api.watch","1362422004",["mediawiki.api","user.tokens"]],["mediawiki.debug","1362422004",["jquery.footHovzer"]],["mediawiki.debug.init","1362422004",["mediawiki.debug"]],["mediawiki.feedback","1362422004",["mediawiki.api.edit","mediawiki.Title","mediawiki.jqueryMsg","jquery.ui.dialog"]],["mediawiki.hidpi","1362422004",["jquery.hidpi"]],["mediawiki.htmlform","1362422004"],["mediawiki.notification","1362422004",["mediawiki.page.startup"]],["mediawiki.notify","1362422004"],["mediawiki.searchSuggest","1364265904",["jquery.autoEllipsis","jquery.client","jquery.placeholder","jquery.suggestions"]],["mediawiki.Title","1362422004",["mediawiki.util"]],["mediawiki.Uri","1362422004"],["mediawiki.user","1362422004",["jquery.cookie","mediawiki.api","user.options","user.tokens"]],["mediawiki.util",
"1364265900",["jquery.client","jquery.cookie","jquery.mwExtension","mediawiki.notify"]],["mediawiki.action.edit","1362422004",["jquery.textSelection","jquery.byteLimit"]],["mediawiki.action.edit.preview","1362422004",["jquery.form","jquery.spinner"]],["mediawiki.action.history","1362422004",[],"mediawiki.action.history"],["mediawiki.action.history.diff","1362422004",[],"mediawiki.action.history"],["mediawiki.action.view.dblClickEdit","1362422004",["mediawiki.util","mediawiki.page.startup"]],["mediawiki.action.view.metadata","1364266054"],["mediawiki.action.view.postEdit","1362422004",["jquery.cookie"]],["mediawiki.action.view.rightClickEdit","1362422004"],["mediawiki.action.watch.ajax","1347062400",["mediawiki.page.watch.ajax"]],["mediawiki.language","1362422004",["mediawiki.language.data","mediawiki.cldr"]],["mediawiki.cldr","1362422004",["mediawiki.libs.pluralruleparser"]],["mediawiki.libs.pluralruleparser","1362422004"],["mediawiki.language.init","1362422004"],["mediawiki.jqueryMsg"
,"1362422004",["mediawiki.util","mediawiki.language"]],["mediawiki.libs.jpegmeta","1362422004"],["mediawiki.page.ready","1362422004",["jquery.checkboxShiftClick","jquery.makeCollapsible","jquery.placeholder","jquery.mw-jump","mediawiki.util"]],["mediawiki.page.startup","1362422004",["jquery.client","mediawiki.util"]],["mediawiki.page.patrol.ajax","1364284192",["mediawiki.page.startup","mediawiki.api","mediawiki.util","mediawiki.Title","mediawiki.notify","jquery.spinner","user.tokens"]],["mediawiki.page.watch.ajax","1364266039",["mediawiki.page.startup","mediawiki.api.watch","mediawiki.util","mediawiki.notify","jquery.mwExtension"]],["mediawiki.special","1362422004"],["mediawiki.special.block","1362422004",["mediawiki.util"]],["mediawiki.special.changeemail","1362422004",["mediawiki.util"]],["mediawiki.special.changeslist","1362422004",["jquery.makeCollapsible"]],["mediawiki.special.movePage","1362422004",["jquery.byteLimit"]],["mediawiki.special.preferences","1362422004"],[
"mediawiki.special.recentchanges","1362422004",["mediawiki.special"]],["mediawiki.special.search","1364265961"],["mediawiki.special.undelete","1362422004"],["mediawiki.special.upload","1362422004",["mediawiki.libs.jpegmeta","mediawiki.util"]],["mediawiki.special.userlogin.signup","1362422004"],["mediawiki.special.javaScriptTest","1362422004",["jquery.qunit"]],["mediawiki.tests.qunit.testrunner","1362422006",["jquery.qunit","jquery.qunit.completenessTest","mediawiki.page.startup","mediawiki.page.ready"]],["mediawiki.legacy.ajax","1362422004",["mediawiki.util","mediawiki.legacy.wikibits"]],["mediawiki.legacy.commonPrint","1362422004"],["mediawiki.legacy.config","1362422004",["mediawiki.legacy.wikibits"]],["mediawiki.legacy.IEFixes","1362422004",["mediawiki.legacy.wikibits"]],["mediawiki.legacy.protect","1362422005",["mediawiki.legacy.wikibits","jquery.byteLimit"]],["mediawiki.legacy.shared","1362688577"],["mediawiki.legacy.oldshared","1362422005"],["mediawiki.legacy.upload","1362422005",
["mediawiki.legacy.wikibits","mediawiki.util"]],["mediawiki.legacy.wikibits","1362422005",["mediawiki.util"]],["mediawiki.legacy.wikiprintable","1362422005"],["ext.gadget.HighlightRedirects","1347062400"],["ext.gadget.References-2-col","1347062400"],["ext.gadget.References-3-col","1347062400"],["ext.gadget.PortalLinksIcon","1347062400"],["ext.gadget.ShortInterwiki","1347062400"],["ext.gadget.WikiMiniAtlas","1347062400"],["ext.gadget.OSMmapa","1347062400"],["ext.gadget.ShowNavbarInNavbox","1347062400",["mediawiki.Title"]],["ext.gadget.OldDiff","1347062400"],["ext.gadget.refToolbar","1361829247",["user.options"]],["mw.MwEmbedSupport","1362422192",["jquery.triggerQueueCallback","Spinner","jquery.loadingSpinner","jquery.mwEmbedUtil","mw.MwEmbedSupport.style"]],["Spinner","1362422192"],["iScroll","1362422192"],["jquery.loadingSpinner","1362422192"],["mw.MwEmbedSupport.style","1362422192"],["mediawiki.UtilitiesTime","1362422192"],["mediawiki.client","1362422192"],["mediawiki.absoluteUrl",
"1362422192"],["mw.ajaxProxy","1362422192"],["fullScreenApi","1362422192"],["jquery.embedMenu","1362422192"],["jquery.ui.touchPunch","1362422192",["jquery.ui.core","jquery.ui.mouse"]],["jquery.triggerQueueCallback","1362422192"],["jquery.mwEmbedUtil","1362422192",["jquery.ui.dialog"]],["jquery.debouncedresize","1362422192"],["mw.Language.names","1362422192"],["mw.Api","1362422192"],["mw.MediaElement","1362422248"],["mw.MediaPlayer","1362422248"],["mw.MediaPlayers","1362422248",["mw.MediaPlayer"]],["mw.MediaSource","1362422248"],["mw.EmbedTypes","1362422248",["mw.MediaPlayers","mediawiki.Uri"]],["mw.EmbedPlayer","1364266534",["mediawiki.client","mediawiki.UtilitiesTime","mediawiki.Uri","mediawiki.absoluteUrl","mediawiki.jqueryMsg","fullScreenApi","mw.EmbedPlayerNative","mw.MediaElement","mw.MediaPlayers","mw.MediaSource","mw.EmbedTypes","jquery.client","jquery.hoverIntent","jquery.cookie","jquery.ui.mouse","jquery.debouncedresize","jquery.embedMenu","jquery.ui.slider",
"jquery.ui.touchPunch","mw.PlayerSkinKskin"]],["mw.EmbedPlayerKplayer","1362422248"],["mw.EmbedPlayerGeneric","1362422248"],["mw.EmbedPlayerJava","1362422248"],["mw.EmbedPlayerNative","1362422248"],["mw.EmbedPlayerImageOverlay","1362422248"],["mw.EmbedPlayerVlc","1362422248"],["mw.PlayerSkinKskin","1362422248"],["mw.PlayerSkinMvpcf","1362422248"],["mw.TimedText","1364266534",["mw.EmbedPlayer","jquery.ui.dialog","mw.TextSource"]],["mw.TextSource","1362422249",["mediawiki.UtilitiesTime","mw.ajaxProxy"]],["mobile.device.","1347062400"],["mobile.device.ie","1363725919"],["mobile.device.iphone","1363725919"],["mobile.device.kindle","1363725919"],["mobile.device.blackberry","1363725919"],["mobile.device.simple","1363725919"],["mobile.device.psp","1363725919"],["mobile.device.wii","1363725919"],["mobile.device.operamini","1363725919"],["mobile.device.operamobile","1363725919"],["mobile.device.nokia","1363725919"],["ext.wikihiero","1362422373"],["ext.wikihiero.Special","1362422373",[
"jquery.spinner"]],["ext.cite","1362422065",["jquery.tooltip"]],["jquery.tooltip","1362422065"],["ext.specialcite","1362422065"],["ext.geshi.local","1347062400"],["ext.categoryTree","1364266048"],["ext.categoryTree.css","1362422042"],["ext.nuke","1362422196"],["ext.centralauth","1362949756",["mediawiki.util"]],["ext.centralauth.noflash","1362422056"],["ext.centralauth.globalusers","1362422056"],["ext.centralauth.globalgrouppermissions","1362422056"],["jquery.ui.multiselect","1364246766",["jquery.ui.core","jquery.ui.sortable","jquery.ui.draggable","jquery.ui.droppable","mediawiki.jqueryMsg"]],["ext.centralNotice.interface","1364246766",["jquery.ui.datepicker","jquery.ui.multiselect"]],["ext.centralNotice.bannerStats","1362422059"],["ext.centralNotice.bannerController","1364246766",["jquery.cookie"]],["ext.collection.jquery.jstorage","1362422075",["jquery.json"]],["ext.collection.suggest","1362422075",["ext.collection.bookcreator"]],["ext.collection","1362422075",[
"ext.collection.bookcreator","jquery.ui.sortable"]],["ext.collection.bookcreator","1362422075",["ext.collection.jquery.jstorage"]],["ext.collection.checkLoadFromLocalStorage","1362422075",["ext.collection.jquery.jstorage"]],["ext.abuseFilter","1362422020"],["ext.abuseFilter.edit","1362422020",["mediawiki.util","jquery.textSelection","jquery.spinner"]],["ext.abuseFilter.tools","1362422020",["mediawiki.util","jquery.spinner"]],["ext.abuseFilter.examine","1362422020",["mediawiki.util"]],["jquery.collapsibleTabs","1362422296",["jquery.delayedBind"],"ext.vector"],["ext.vector.collapsibleNav","1364265914",["mediawiki.util","jquery.client","jquery.cookie","jquery.tabIndex"],"ext.vector"],["ext.vector.collapsibleTabs","1362422296",["jquery.collapsibleTabs","jquery.delayedBind"],"ext.vector"],["ext.vector.editWarning","1364265914",[],"ext.vector"],["ext.vector.expandableSearch","1362422296",["jquery.client","jquery.expandableField","jquery.delayedBind"],"ext.vector"],["ext.vector.footerCleanup"
,"1362422296",["mediawiki.jqueryMsg","jquery.cookie"],"ext.vector"],["ext.vector.sectionEditLinks","1362422296",["jquery.cookie","jquery.clickTracking"],"ext.vector"],["contentCollector","1362422326",[],"ext.wikiEditor"],["jquery.wikiEditor","1364266036",["jquery.client","jquery.textSelection","jquery.delayedBind"],"ext.wikiEditor"],["jquery.wikiEditor.iframe","1362422326",["jquery.wikiEditor","contentCollector"],"ext.wikiEditor"],["jquery.wikiEditor.dialogs","1362422326",["jquery.wikiEditor","jquery.wikiEditor.toolbar","jquery.ui.dialog","jquery.ui.button","jquery.ui.draggable","jquery.ui.resizable","jquery.tabIndex"],"ext.wikiEditor"],["jquery.wikiEditor.dialogs.config","1364266036",["jquery.wikiEditor","jquery.wikiEditor.dialogs","jquery.wikiEditor.toolbar.i18n","jquery.suggestions","mediawiki.Title","mediawiki.jqueryMsg"],"ext.wikiEditor"],["jquery.wikiEditor.highlight","1362422326",["jquery.wikiEditor","jquery.wikiEditor.iframe"],"ext.wikiEditor"],["jquery.wikiEditor.preview",
"1362422326",["jquery.wikiEditor"],"ext.wikiEditor"],["jquery.wikiEditor.previewDialog","1362422326",["jquery.wikiEditor","jquery.wikiEditor.dialogs"],"ext.wikiEditor"],["jquery.wikiEditor.publish","1362422326",["jquery.wikiEditor","jquery.wikiEditor.dialogs"],"ext.wikiEditor"],["jquery.wikiEditor.templateEditor","1362422326",["jquery.wikiEditor","jquery.wikiEditor.iframe","jquery.wikiEditor.dialogs"],"ext.wikiEditor"],["jquery.wikiEditor.templates","1362422326",["jquery.wikiEditor","jquery.wikiEditor.iframe"],"ext.wikiEditor"],["jquery.wikiEditor.toc","1362422326",["jquery.wikiEditor","jquery.wikiEditor.iframe","jquery.ui.draggable","jquery.ui.resizable","jquery.autoEllipsis","jquery.color"],"ext.wikiEditor"],["jquery.wikiEditor.toolbar","1362422326",["jquery.wikiEditor","jquery.wikiEditor.toolbar.i18n"],"ext.wikiEditor"],["jquery.wikiEditor.toolbar.config","1362422326",["jquery.wikiEditor","jquery.wikiEditor.toolbar.i18n","jquery.wikiEditor.toolbar","jquery.cookie","jquery.async"],
"ext.wikiEditor"],["jquery.wikiEditor.toolbar.i18n","1347062400",[],"ext.wikiEditor"],["ext.wikiEditor","1362422326",["jquery.wikiEditor"],"ext.wikiEditor"],["ext.wikiEditor.dialogs","1362422326",["ext.wikiEditor","ext.wikiEditor.toolbar","jquery.wikiEditor.dialogs","jquery.wikiEditor.dialogs.config"],"ext.wikiEditor"],["ext.wikiEditor.highlight","1362422326",["ext.wikiEditor","jquery.wikiEditor.highlight"],"ext.wikiEditor"],["ext.wikiEditor.preview","1362422326",["ext.wikiEditor","jquery.wikiEditor.preview"],"ext.wikiEditor"],["ext.wikiEditor.previewDialog","1362422326",["ext.wikiEditor","jquery.wikiEditor.previewDialog"],"ext.wikiEditor"],["ext.wikiEditor.publish","1362422326",["ext.wikiEditor","jquery.wikiEditor.publish"],"ext.wikiEditor"],["ext.wikiEditor.templateEditor","1362422326",["ext.wikiEditor","ext.wikiEditor.highlight","jquery.wikiEditor.templateEditor"],"ext.wikiEditor"],["ext.wikiEditor.templates","1362422326",["ext.wikiEditor","ext.wikiEditor.highlight",
"jquery.wikiEditor.templates"],"ext.wikiEditor"],["ext.wikiEditor.toc","1362422326",["ext.wikiEditor","ext.wikiEditor.highlight","jquery.wikiEditor.toc"],"ext.wikiEditor"],["ext.wikiEditor.tests.toolbar","1362422326",["ext.wikiEditor.toolbar"],"ext.wikiEditor"],["ext.wikiEditor.toolbar","1362422326",["ext.wikiEditor","jquery.wikiEditor.toolbar","jquery.wikiEditor.toolbar.config"],"ext.wikiEditor"],["ext.wikiEditor.toolbar.hideSig","1362422326",[],"ext.wikiEditor"],["mobile.site","1347062400",[],"site"],["mobile.desktop","1363725919",["jquery.cookie"]],["mobile.watchlist.schema","1347062400",["ext.eventLogging"]],["mobile.uploads.schema","1347062400",["ext.eventLogging"]],["ext.math.mathjax","1362422173",[],"ext.math.mathjax"],["ext.math.mathjax.enabler","1362422175"],["ext.babel","1362422039"],["ext.apiSandbox","1362422025",["mediawiki.util","jquery.ui.button"]],["ext.interwiki.specialpage","1362422152",["jquery.makeCollapsible"]],["ext.codeEditor","1362422068",[
"ext.wikiEditor.toolbar","jquery.codeEditor"],"ext.wikiEditor"],["jquery.codeEditor","1362422068",["jquery.wikiEditor","ext.codeEditor.ace","jquery.ui.resizable"],"ext.wikiEditor"],["ext.codeEditor.ace","1362422068",[],"ext.codeEditor.ace"],["ext.codeEditor.ace.modes","1362422068",["ext.codeEditor.ace"],"ext.codeEditor.ace"],["ext.codeEditor.geshi","1362422068",[],"ext.wikiEditor"],["ext.scribunto","1363108067",["jquery.ui.dialog"]],["ext.scribunto.edit","1362422228",["ext.scribunto","mediawiki.api"]],["ext.eventLogging","1362422118",["jquery.json","mediawiki.util"]],["ext.eventLogging.jsonSchema","1362422118"],["schema.NavigationTiming","1347062400",["ext.eventLogging"]],["ext.navigationTiming","1363910669",["schema.NavigationTiming"]],["dataValues","1362423124"],["dataValues.DataValue","1362423124",["dataValues","dataValues.util"]],["dataValues.values","1362423124",["dataValues.DataValue"]],["dataValues.util","1362423124",["dataValues"]],["valueParsers","1362422093"],[
"valueParsers.ValueParser","1362423124",["valueParsers","valueParsers.util"]],["valueParsers.factory","1362423124",["valueParsers.ValueParser"]],["valueParsers.parsers","1362422093",["valueParsers.ValueParser","valueParsers.api"]],["valueParsers.util","1362422093",["dataValues.util","valueParsers"]],["valueParsers.api","1362423124",["valueParsers","dataValues.values","jquery.json"]],["dataTypes","1362599756",["dataTypes.dataTypesModule","dataValues","valueParsers"]],["dataTypes.jquery.valueview","1362423124",["dataTypes","dataValues.util","dataValues.values","jquery.eachchange","jquery.ui.widget","valueParsers.parsers"]],["dataTypes.jquery.valueview.views","1362423124",["dataTypes.jquery.valueview","jquery.eachchange"]],["dataTypes.dataTypesModule","1347062400"],["jquery.eachchange","1362423124",["jquery.client"]],["jquery.inputAutoExpand","1362423124",["jquery.eachchange"]],["wikibase.common","1362423073"],["wikibase.sites","1347062400"],["wikibase.repoAccess","1347062400"],[
"wikibase","1362423073",["wikibase.common","wikibase.sites","wikibase.templates"]],["wikibase.parsers","1362423073",["valueParsers.ValueParser","valueParsers.api","wikibase.datamodel"]],["wikibase.datamodel","1362423073",["wikibase","wikibase.utilities","dataValues.values","dataTypes"]],["wikibase.serialization","1362423073",["wikibase","wikibase.utilities"]],["wikibase.serialization.entities","1362423073",["wikibase.serialization","wikibase.datamodel"]],["wikibase.serialization.fetchedcontent","1362423073",["wikibase.serialization","wikibase.store.FetchedContent"]],["wikibase.store","1362423073",["jquery.json","user.tokens","wikibase.datamodel","wikibase.serialization.entities","wikibase.repoAccess","wikibase.RepoApiError","mediawiki.Title"]],["wikibase.store.FetchedContent","1362423073",["wikibase.store","mediawiki.Title"]],["wikibase.RepoApiError","1362423073",["wikibase","wikibase.utilities"]],["wikibase.utilities","1362423073",["wikibase","jquery.tipsy","mediawiki.language"]],[
"wikibase.utilities.jQuery","1362423073",["wikibase.utilities"]],["wikibase.utilities.jQuery.ui.tagadata","1362422346",["jquery.eachchange","jquery.effects.blind","jquery.inputAutoExpand","jquery.ui.widget"]],["wikibase.tests.qunit.testrunner","1362423073",["mediawiki.tests.qunit.testrunner","wikibase"]],["wikibase.ui.Base","1362423073",["wikibase","wikibase.utilities"]],["wikibase.ui.Tooltip","1362423073",["jquery.nativeEventHandler","jquery.tipsy","wikibase","wikibase.RepoApiError","wikibase.ui.Base","wikibase.utilities"]],["wikibase.ui.Toolbar","1362423073",["jquery.nativeEventHandler","jquery.ui.core","mediawiki.legacy.shared","wikibase","wikibase.common","wikibase.ui.Base","wikibase.ui.Tooltip","wikibase.utilities","wikibase.utilities.jQuery"]],["wikibase.ui.PropertyEditTool","1362423073",["jquery.eachchange","jquery.nativeEventHandler","jquery.inputAutoExpand","jquery.tablesorter","jquery.ui.suggester","jquery.wikibase.entityselector","jquery.wikibase.siteselector",
"mediawiki.api","mediawiki.language","mediawiki.Title","mediawiki.jqueryMsg","wikibase","wikibase.ui.Base","wikibase.ui.Toolbar","wikibase.utilities","wikibase.utilities.jQuery","wikibase.utilities.jQuery.ui.tagadata","wikibase.store"]],["jquery.wikibase.addtoolbar","1362423072",["jquery.ui.widget","wikibase.ui.Toolbar"]],["jquery.wikibase.edittoolbar","1362423072",["wikibase.ui.PropertyEditTool"]],["wikibase.templates","1362423073"],["jquery.ui.TemplatedWidget","1362422346",["wikibase.templates","jquery.ui.widget"]],["jquery.nativeEventHandler","1362422346"],["jquery.ui.suggester","1362423072",["jquery.ui.autocomplete"]],["jquery.wikibase.siteselector","1362422346",["jquery.ui.suggester","wikibase"]],["jquery.wikibase.listview","1362423073",["jquery.ui.TemplatedWidget","jquery.wikibase.edittoolbar"]],["jquery.wikibase.snakview","1362423073",["jquery.eachchange","jquery.nativeEventHandler","jquery.wikibase.entityselector","wikibase.datamodel","dataTypes.jquery.valueview.views",
"wikibase.jquery.valueview.views","wikibase.store","mediawiki.legacy.shared","jquery.ui.TemplatedWidget"]],["jquery.wikibase.claimview","1362423072",["jquery.wikibase.snakview"]],["jquery.wikibase.referenceview","1362423073",["jquery.wikibase.claimview"]],["jquery.wikibase.statementview","1362423073",["jquery.wikibase.addtoolbar","jquery.wikibase.claimview","jquery.wikibase.listview","jquery.wikibase.referenceview","wikibase.utilities"]],["jquery.wikibase.claimlistview","1362423072",["jquery.wikibase.claimview","jquery.wikibase.edittoolbar","wikibase.templates"]],["jquery.wikibase.entityview","1362423072",["jquery.wikibase.addtoolbar","jquery.wikibase.statementview","jquery.wikibase.claimlistview","wikibase.templates"]],["jquery.wikibase.entityselector","1362423073",["jquery.ui.suggester","jquery.ui.resizable","jquery.eachchange"]],["wikibase.jquery.valueview.views","1362423072",["dataTypes.jquery.valueview","wikibase.parsers","jquery.eachchange"]],["wikibase.client.init","1362422345"]
,["wikibase.client.nolanglinks","1362599751"],["wikibase.client.currentSite","1347062400"],["wikibase.client.page-move","1362422345"],["wbclient.watchlist.css","1362422345"],["wbclient.watchlist","1364266418"],["wbclient.linkItem","1362599751",["jquery.spinner","jquery.ui.dialog","jquery.ui.suggester","jquery.wikibase.siteselector","mediawiki.api","mediawiki.jqueryMsg","wikibase.client.currentSite","wikibase.sites","wikibase.store","wikibase.ui.Tooltip"]],["ext.TemplateSandbox","1362422246"],["ext.checkUser","1362422063",["mediawiki.util"]],["mw.PopUpMediaTransform","1362422249",["jquery.ui.dialog"]],["embedPlayerIframeStyle","1362422249"],["ext.tmh.transcodetable","1362422249"],["mw.MediaWikiPlayerSupport","1362422249",["mw.Api"]]]);mw.config.set({"wgLoadScript":"//bits.wikimedia.org/cs.wikipedia.org/load.php","debug":false,"skin":"vector","stylepath":"//bits.wikimedia.org/static-1.21wmf11/skins","wgUrlProtocols":
"http\\:\\/\\/|https\\:\\/\\/|ftp\\:\\/\\/|irc\\:\\/\\/|ircs\\:\\/\\/|gopher\\:\\/\\/|telnet\\:\\/\\/|nntp\\:\\/\\/|worldwind\\:\\/\\/|mailto\\:|news\\:|svn\\:\\/\\/|git\\:\\/\\/|mms\\:\\/\\/|\\/\\/","wgArticlePath":"/wiki/$1","wgScriptPath":"/w","wgScriptExtension":".php","wgScript":"/w/index.php","wgVariantArticlePath":false,"wgActionPaths":{},"wgServer":"//cs.wikipedia.org","wgUserLanguage":"cs","wgContentLanguage":"cs","wgVersion":"1.21wmf11","wgEnableAPI":true,"wgEnableWriteAPI":true,"wgMainPageTitle":"Hlavní strana","wgFormattedNamespaces":{"-2":"Média","-1":"Speciální","0":"","1":"Diskuse","2":"Wikipedista","3":"Diskuse s wikipedistou","4":"Wikipedie","5":"Diskuse k Wikipedii","6":"Soubor","7":"Diskuse k souboru","8":"MediaWiki","9":"Diskuse k MediaWiki","10":"Šablona","11":"Diskuse k šabloně","12":"Nápověda","13":"Diskuse k nápovědě","14":"Kategorie","15":"Diskuse ke kategorii","100":"Portál","101":"Diskuse k portálu","102":"Rejstřík","103":
"Diskuse k rejstříku","828":"Module","829":"Module talk"},"wgNamespaceIds":{"média":-2,"speciální":-1,"":0,"diskuse":1,"wikipedista":2,"diskuse_s_wikipedistou":3,"wikipedie":4,"diskuse_k_wikipedii":5,"soubor":6,"diskuse_k_souboru":7,"mediawiki":8,"diskuse_k_mediawiki":9,"šablona":10,"diskuse_k_šabloně":11,"nápověda":12,"diskuse_k_nápovědě":13,"kategorie":14,"diskuse_ke_kategorii":15,"portál":100,"diskuse_k_portálu":101,"rejstřík":102,"diskuse_k_rejstříku":103,"module":828,"module_talk":829,"uživatel_diskuse":3,"uživatelka_diskuse":3,"soubor_diskuse":7,"mediawiki_diskuse":9,"šablona_diskuse":11,"nápověda_diskuse":13,"kategorie_diskuse":15,"wikipedie_diskuse":5,"wikipedistka":2,"diskuse_s_wikipedistkou":3,"uživatel":2,"diskuse_s_uživatelem":3,"wikipedista_diskuse":3,"wikipedistka_diskuse":3,"wp":4,"portal":100,"portal_talk":101,"portál_diskuse":101,"rejstřík_diskuse":103,"image":6,"image_talk":7,"media":-2,"special":-1,"talk":1,"user":2,"user_talk":3,
"project":4,"project_talk":5,"file":6,"file_talk":7,"mediawiki_talk":9,"template":10,"template_talk":11,"help":12,"help_talk":13,"category":14,"category_talk":15},"wgSiteName":"Wikipedie","wgFileExtensions":["png","gif","jpg","jpeg","xcf","pdf","mid","ogg","ogv","svg","djvu","tiff","tif","ogg","ogv","oga","webm"],"wgDBname":"cswiki","wgFileCanRotate":true,"wgAvailableSkins":{"monobook":"MonoBook","vector":"Vector","standard":"Standard","nostalgia":"Nostalgia","myskin":"MySkin","cologneblue":"CologneBlue","modern":"Modern","simple":"Simple","chick":"Chick"},"wgExtensionAssetsPath":"//bits.wikimedia.org/static-1.21wmf11/extensions","wgCookiePrefix":"cswiki","wgResourceLoaderMaxQueryLength":-1,"wgCaseSensitiveNamespaces":[],"EmbedPlayer.DirectFileLinkWarning":true,"EmbedPlayer.EnableOptionsMenu":true,"EmbedPlayer.DisableJava":false,"EmbedPlayer.DisableHTML5FlashFallback":true,"TimedText.ShowInterface":"always","TimedText.ShowAddTextLink":true,"EmbedPlayer.WebPath":
"//bits.wikimedia.org/static-1.21wmf11/extensions/TimedMediaHandler/MwEmbedModules/EmbedPlayer","wgCortadoJarFile":false,"TimedText.ShowInterface.local":"off","AjaxRequestTimeout":30,"MediaWiki.DefaultProvider":"local","MediaWiki.ApiProviders":{"wikimediacommons":{"url":"//commons.wikimedia.org/w/api.php"}},"MediaWiki.ApiPostActions":["login","purge","rollback","delete","undelete","protect","block","unblock","move","edit","upload","emailuser","import","userrights"],"EmbedPlayer.OverlayControls":true,"EmbedPlayer.CodecPreference":["webm","h264","ogg"],"EmbedPlayer.DisableVideoTagSupport":false,"EmbedPlayer.ReplaceSources":null,"EmbedPlayer.EnableFlavorSelector":false,"EmbedPlayer.EnableIpadHTMLControls":true,"EmbedPlayer.WebKitPlaysInline":false,"EmbedPlayer.EnableIpadNativeFullscreen":false,"EmbedPlayer.iPhoneShowHTMLPlayScreen":true,"EmbedPlayer.ForceLargeReplayButton":false,"EmbedPlayer.LibraryPage":"http://www.kaltura.org/project/HTML5_Video_Media_JavaScript_Library",
"EmbedPlayer.RewriteSelector":"video,audio,playlist","EmbedPlayer.DefaultSize":"400x300","EmbedPlayer.ControlsHeight":31,"EmbedPlayer.TimeDisplayWidth":85,"EmbedPlayer.KalturaAttribution":true,"EmbedPlayer.AttributionButton":{"title":"Kaltura html5 video library","href":"http://www.kaltura.com","class":"kaltura-icon","style":[],"iconurl":false},"EmbedPlayer.EnableRightClick":true,"EmbedPlayer.EnabledOptionsMenuItems":["playerSelect","download","share","aboutPlayerLibrary"],"EmbedPlayer.WaitForMeta":true,"EmbedPlayer.ShowNativeWarning":true,"EmbedPlayer.ShowPlayerAlerts":true,"EmbedPlayer.EnableFullscreen":true,"EmbedPlayer.EnableTimeDisplay":true,"EmbedPlayer.EnableVolumeControl":true,"EmbedPlayer.NewWindowFullscreen":false,"EmbedPlayer.FullscreenTip":true,"EmbedPlayer.FirefoxLink":"http://www.mozilla.com/en-US/firefox/upgrade.html?from=mwEmbed","EmbedPlayer.NativeControls":false,"EmbedPlayer.NativeControlsMobileSafari":true,"EmbedPlayer.FullScreenZIndex":999998,
"EmbedPlayer.ShareEmbedMode":"iframe","EmbedPlayer.SkinList":["mvpcf","kskin"],"EmbedPlayer.DefaultSkin":"mvpcf","EmbedPlayer.MonitorRate":250,"EmbedPlayer.UseFlashOnAndroid":false,"EmbedPlayer.EnableURLTimeEncoding":"flash","EmbedPLayer.IFramePlayer.DomainWhiteList":"*","EmbedPlayer.EnableIframeApi":true,"EmbedPlayer.PageDomainIframe":true,"EmbedPlayer.NotPlayableDownloadLink":true,"EmbedPlayer.BlackPixel":"data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%01%00%00%00%01%08%02%00%00%00%90wS%DE%00%00%00%01sRGB%00%AE%CE%1C%E9%00%00%00%09pHYs%00%00%0B%13%00%00%0B%13%01%00%9A%9C%18%00%00%00%07tIME%07%DB%0B%0A%17%041%80%9B%E7%F2%00%00%00%19tEXtComment%00Created%20with%20GIMPW%81%0E%17%00%00%00%0CIDAT%08%D7c%60%60%60%00%00%00%04%00%01\'4\'%0A%00%00%00%00IEND%AEB%60%82","TimedText.ShowRequestTranscript":false,"TimedText.NeedsTranscriptCategory":"Videos needing subtitles","TimedText.BottomPadding":10,"TimedText.BelowVideoBlackBoxHeight":40,"wgCollectionVersion":"1.6.1",
"wgCollapsibleNavBucketTest":false,"wgCollapsibleNavForceNewVersion":false,"wgWikiEditorToolbarClickTracking":false,"wgWikiEditorMagicWords":{"redirect":"#PŘESMĚRUJ","img_right":"vpravo","img_left":"vlevo","img_none":"žádné","img_center":"střed","img_thumbnail":"náhled","img_framed":"rám","img_frameless":"bezrámu"},"wgCookiePath":"/","wgMFStopRedirectCookieHost":".wikipedia.org","wgEventLoggingBaseUri":"//bits.wikimedia.org/event.gif","wgNavigationTimingSamplingFactor":10000,"wgNoticeFundraisingUrl":"https://donate.wikimedia.org/wiki/Special:LandingCheck","wgCentralPagePath":"//meta.wikimedia.org/w/index.php","wgNoticeBannerListLoader":"Speciální:BannerListLoader","wgCentralBannerDispatcher":"//meta.wikimedia.org/wiki/Special:BannerRandom","wgCentralBannerRecorder":"//meta.wikimedia.org/wiki/Special:RecordImpression","wgNoticeXXCountries":["XX","EU","AP","A1","A2","O1"],"wgNoticeNumberOfBuckets":4,"wgNoticeBucketExpiry":7,"wgNoticeNumberOfControllerBuckets":2,
"wgNoticeCookieShortExpiry":1209600});};if(isCompatible()){document.write("\x3cscript src=\"//bits.wikimedia.org/cs.wikipedia.org/load.php?debug=false\x26amp;lang=cs\x26amp;modules=jquery%2Cmediawiki%2CSpinner%7Cjquery.triggerQueueCallback%2CloadingSpinner%2CmwEmbedUtil%7Cmw.MwEmbedSupport\x26amp;only=scripts\x26amp;skin=vector\x26amp;version=20130304T183632Z\"\x3e\x3c/script\x3e");}delete isCompatible;
/* cache key: cswiki:resourceloader:filter:minify-js:7:9e5a1c1c92a2516e15d1303e9d7b2afa */