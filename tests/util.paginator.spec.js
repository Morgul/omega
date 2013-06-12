// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the util.paginator.spec.js module.
//
// @module util.paginator.spec.js
// ---------------------------------------------------------------------------------------------------------------------

var assert = require("assert");

var Paginator = require('../util/paginator');

// ---------------------------------------------------------------------------------------------------------------------

describe('Paginator', function()
{
    var paginator;
    var items = [
        "Apples", "Bannanas", "Limes", "Lemons", "Cherries", "Pineapples", "Oranges", "Blueberries", "Watermelons"
    ];

    beforeEach(function()
    {
        paginator = new Paginator(items, 2);
    });

    it('reports the total number of objects', function()
    {
        assert.equal(paginator.count, 9);
    });

    it('calculates the total number of pages', function()
    {
        assert.equal(paginator.num_pages, 5);
    });

    it('returns a range of pages', function()
    {
        var range = [1, 2, 3, 4, 5];
        assert.deepEqual(paginator.page_range, range);
    });

    it('returns a Page object for the requested page', function()
    {
        var page = paginator.page(2);
        assert.equal(page.pageNum, 2);
    });

    it('clamps to the first page when the requested page number is too small', function()
    {
        var page = paginator.page(0);
        assert.equal(page.pageNum, 1);
    });

    it('clamps to the last page when the requested page number is too large', function()
    {
        var page = paginator.page(25);
        assert.equal(page.pageNum, paginator.num_pages);
    });

    describe('Page', function()
    {
        var page1, page2, page3, page4, page5;
        beforeEach(function()
        {
            page1 = paginator.page(1);
            page2 = paginator.page(2);
            page3 = paginator.page(3);
            page4 = paginator.page(4);
            page5 = paginator.page(5);
        });

        it('has the correctly paginated contents', function()
        {
            assert.deepEqual(page2.contents, ["Limes", "Lemons"])
        });

        it('returns `true` for `has_next`, when not on the last page', function()
        {
            assert(page1.has_next);
            assert(page2.has_next);
            assert(page3.has_next);
            assert(page4.has_next);
            assert(!page5.has_next);
        });

        it('returns `true` for `has_previous`, when not on the first page', function()
        {
            assert(!page1.has_previous);
            assert(page2.has_previous);
            assert(page3.has_previous);
            assert(page4.has_previous);
            assert(page5.has_previous);
        });

        it('returns the correct page number for `next_page`', function()
        {
            assert.equal(page1.next_page, 2);
            assert.equal(page2.next_page, 3);
            assert.equal(page3.next_page, 4);
            assert.equal(page4.next_page, 5);
            assert.equal(page5.next_page, 5);
        });

        it('returns the correct page number for `prev_page`', function()
        {
            assert.equal(page1.prev_page, 1);
            assert.equal(page2.prev_page, 1);
            assert.equal(page3.prev_page, 2);
            assert.equal(page4.prev_page, 3);
            assert.equal(page5.prev_page, 4);
        });

        it.skip('returns `true` for `has_other_pages` only when there are more than one page', function()
        {
            assert(false, "Not Implemented");
        });

        it.skip('returns the starting index of it\'s contents', function()
        {
            assert(false, "Not Implemented");
        });

        it.skip('returns the ending index of it\'s contents', function()
        {
            assert(false, "Not Implemented");
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------