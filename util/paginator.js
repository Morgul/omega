//----------------------------------------------------------------------------------------------------------------------
// A nice, built-in paginator with a syntax taken from Django's paginator
//
// @module paginator
//----------------------------------------------------------------------------------------------------------------------

function Page(contents, config)
{
    this.paginator = config.paginator;
    this.pageNum = config.page;
    this.start_index = config.startIndex;
    this.end_index = config.endIndex;
    this.contents = contents;
} // end Page

Page.prototype = {
    get has_next()
    {
        return this.next_page_number != this.pageNum
    },
    get has_previous()
    {
        return this.prev_page_number != this.pageNum
    },
    get has_other_pages()
    {
        return this.paginator.num_pages > 1;
    },
    get next_page_number()
    {
        var nextNum = this.pageNum + 1;
        var num_pages = this.paginator.num_pages;

        // Clamp to a maximum of num_pages
        if(nextNum > num_pages)
        {
            nextNum = num_pages;
        } // end if

        return nextNum;
    },
    get prev_page_number()
    {
        var prevNum = this.pageNum - 1;

        // Clamp to a minimum of 1
        if(prevNum < 1)
        {
            prevNum = 1;
        } // end if

        return prevNum;
    }
}; // end prototype

Page.prototype.toString = function()
{
    return "<Page " + this.pageNum + " of " + this.paginator.num_pages + ">"
}; // end toString

//----------------------------------------------------------------------------------------------------------------------

function Paginator(objects, numPerPage)
{
    this.objects = objects;
    this.numPerPage = numPerPage;

    this._num_pages = Math.ceil(this.objects.length / this.numPerPage);
} // end Paginator

Paginator.prototype = {
    get count()
    {
        return this.objects.length;
    },
    get num_pages()
    {
        return this._num_pages;
    },
    get page_range()
    {
        var range = [];

        // Generate range
        for(var idx=1; idx<=this.num_pages; idx++)
        {
            range.push(idx);
        } // end for

        return range;
    }
}; // end prototype

Paginator.prototype.page = function(page)
{
    // Clamp our request to only available pages
    if(page < 1)
    {
        page = 1;
    } // end if

    if(page > this.num_pages)
    {
        page = this.num_pages;
    } // end if

    var endIndex = page * this.numPerPage;
    var startIndex = endIndex - this.numPerPage;
    var contents = this.objects.slice(startIndex, endIndex);

    return new Page(contents, {page: page, paginator: this, startIndex: startIndex, endIndex: endIndex});
}; // end page

//----------------------------------------------------------------------------------------------------------------------

module.exports = Paginator;

//----------------------------------------------------------------------------------------------------------------------