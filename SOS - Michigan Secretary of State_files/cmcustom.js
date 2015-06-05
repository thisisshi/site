function cmCustomLinkClickHandler(link) {
	if ((link.href.indexOf(".doc") > -1) || (link.href.indexOf(".docx") > -1) || (link.href.indexOf(".xls") > -1) || (link.href.indexOf(".xlsx") > -1) || (link.href.indexOf(".ppt") > -1) || (link.href.indexOf(".pps") > -1) || (link.href.indexOf(".pdf") > -1) || (link.href.indexOf(".jpg") > -1) || (link.href.indexOf(".gif") > -1) || (link.href.indexOf(".tif") > -1) || (link.href.indexOf(".eps") > -1) || (link.href.indexOf(".png") > -1) || (link.href.indexOf(".mp3") > -1) ) {
		// this split is to remove the document timestamp tagging
		myHref=link.href.split('?')[0];
		cmCreatePageviewTag(myHref, "FILE DOWNLOADS");
	}
}