﻿/*jslint vars: true*/
/*global describe, it, expect, waits, waitsFor, runs, afterEach, spyOn, $*/

describe('pages.pages.api.behavior', function () {
    'use strict';

    var constants = {
        testPageId: 'f0464c233b67406babe8a20400b4d8b8',
        testPageTitle: '_0000_Page_For_Tests',
        testPageUrl: '/0000-page-for-tests/'
    };

    it('01000: Should get list of pages', function() {
        var url = '/bcms-api/pages/',
            result,
            ready = false;

        var data = {
            filter: { 
                where: [ { field: 'Title', operation: 'StartsWith', value: '_0000_' } ]
            },
            take: 2,
            includeUnpublished: true,
            includeArchived: true
        };

        runs(function () {
            api.get(url, data, function (json) {
                result = json;
                ready = true;
            });
        });

        waitsFor(function () {
            return ready;
        }, 'The ' + url + ' timeout.');

        runs(function () {
            expect(result).toBeDefinedAndNotNull('JSON object should be retrieved.');
            expect(result.data).toBeDefinedAndNotNull('JSON data object should be retrieved.');
            expect(result.data.totalCount).toBe(4, 'Total count should be 4.');
            expect(result.data.items.length).toBe(2, 'Returned array length should be 2.');

            expect(result.data.items[0].title.substr(0, 6)).toBe('_0000_', 'Correctly filtered items[0].title should be retrieved.');
            expect(result.data.items[1].title.substr(0, 6)).toBe('_0000_', 'Correctly filtered items[1].title should be retrieved.');
        });
    });
    
    it('01001: Should get one page in list', function () {
        var url = '/bcms-api/pages/',
            result,
            ready = false;

        var data = {
            filter: {
                where: [{ field: 'Title', value: constants.testPageTitle }]
            },
            includeArchived: true
        };

        runs(function () {
            api.get(url, data, function (json) {
                result = json;
                ready = true;
            });
        });

        waitsFor(function () {
            return ready;
        }, 'The ' + url + ' timeout.');

        runs(function () {
            expect(result).toBeDefinedAndNotNull('JSON object should be retrieved.');
            expect(result.data).toBeDefinedAndNotNull('JSON data object should be retrieved.');
            expect(result.data.totalCount).toBe(1, 'Total count should be 1.');
            expect(result.data.items.length).toBe(1, 'Returned array length should be 1.');

            expectPageListItemPropertiesAreNotNull(result.data.items[0]);
        });
    });

    it('01002: Should get page by id', function() {
        var url = '/bcms-api/pages/' + constants.testPageId,
            result,
            ready = false;

        runs(function () {
            api.get(url, null, function (json) {
                result = json;
                ready = true;
            });
        });

        waitsFor(function () {
            return ready;
        }, 'The ' + url + ' timeout.');

        runs(function () {
            expect(result).toBeDefinedAndNotNull('JSON object should be retrieved.');
            expect(result.data).toBeDefinedAndNotNull('JSON data object should be retrieved.');

            expectPagePropertiesAreNotNull(result.data);
        });
    });

    it('01003: Should get page by url', function () {
        var url = '/bcms-api/pages/by-url/' + constants.testPageUrl,
            result,
            ready = false;

        runs(function () {
            api.get(url, null, function (json) {
                result = json;
                ready = true;
            });
        });

        waitsFor(function () {
            return ready;
        }, 'The ' + url + ' timeout.');

        runs(function () {
            expect(result).toBeDefinedAndNotNull('JSON object should be retrieved.');
            expect(result.data).toBeDefinedAndNotNull('JSON data object should be retrieved.');

            expectPagePropertiesAreNotNull(result.data);
        });
    });

    it('01004: Should get page properties by id', function () {
        var url = '/bcms-api/page-properties/' + constants.testPageId,
             result,
             ready = false;

        var data = {
            includeTags: true,
            includeLayout: true,
            includeCategory: true,
            includeImages: true,
            includeMetaData: true,
            includePageContents: true,
            includePageOptions: true
        };

        runs(function () {
            api.get(url, data, function (json) {
                result = json;
                ready = true;
            });
        });

        waitsFor(function () {
            return ready;
        }, 'The ' + url + ' timeout.');

        runs(function () {
            expect(result).toBeDefinedAndNotNull('JSON object should be retrieved.');
            expect(result.data).toBeDefinedAndNotNull('JSON data object should be retrieved.');

            expectPagePropertiesPropertiesAreNotNull(result);
        });
    });

    it('01005: Should get page properties by url', function () {
        var url = '/bcms-api/page-properties/by-url/' + constants.testPageUrl,
              result,
              ready = false;

        var data = {
            includeTags: true,
            includeLayout: true,
            includeCategory: true,
            includeImages: true,
            includeMetaData: true,
            includePageContents: true,
            includePageOptions: true
        };

        runs(function () {
            api.get(url, data, function (json) {
                result = json;
                ready = true;
            });
        });

        waitsFor(function () {
            return ready;
        }, 'The ' + url + ' timeout.');

        runs(function () {
            expect(result).toBeDefinedAndNotNull('JSON object should be retrieved.');
            expect(result.data).toBeDefinedAndNotNull('JSON data object should be retrieved.');

            expectPagePropertiesPropertiesAreNotNull(result);
        });
    });
    
    it('01006: Page should exist', function () {
        var url = '/bcms-api/page-exists/' + constants.testPageUrl,
              result,
              ready = false;

        runs(function () {
            api.get(url, null, function (json) {
                result = json;
                ready = true;
            });
        });

        waitsFor(function () {
            return ready;
        }, 'The ' + url + ' timeout.');

        runs(function () {
            expect(result).toBeDefinedAndNotNull('JSON object should be retrieved.');
            expect(result.data).toBeDefinedAndNotNull('JSON data object should be retrieved.');
            expect(result.data.exists).toBe(true, 'Correctly filtered exists should be retrieved.');
            expect(result.data.pageId).toBe(constants.testPageId, 'Correctly filtered pageId should be retrieved.');
        });
    });

    it('01007: Page should not exist', function () {
        var url = '/bcms-api/page-exists/7E78D59E-6747-46D1-B71D-852F44F99E71/',
              result,
              ready = false;

        runs(function () {
            api.get(url, null, function (json) {
                result = json;
                ready = true;
            });
        });

        waitsFor(function () {
            return ready;
        }, 'The ' + url + ' timeout.');

        runs(function () {
            expect(result).toBeDefinedAndNotNull('JSON object should be retrieved.');
            expect(result.data).toBeDefinedAndNotNull('JSON data object should be retrieved.');
            expect(result.data.exists).toBe(false, 'Correctly filtered exists should be retrieved.');
            expect(result.data.pageId).toBeNull('pageId should be null.');
        });
    });

    it('01008: Should get page contents', function () {
        var url = '/bcms-api/pages/' + constants.testPageId + '/contents/',
              result,
              ready = false;

        runs(function () {
            api.get(url, null, function (json) {
                result = json;
                ready = true;
            });
        });

        waitsFor(function () {
            return ready;
        }, 'The ' + url + ' timeout.');

        runs(function () {
            expect(result).toBeDefinedAndNotNull('JSON object should be retrieved.');
            expect(result.data).toBeDefinedAndNotNull('JSON data object should be retrieved.');
            expect(result.data.items).not.toBeNull('JSON data.items object should be retrieved.');
            
            var contents = result.data.items;
            expect(contents.length).toBe(5, 'Returned array length should be 5.');
            
            var contentsFound = 0;
            for (var i = 0; i < contents.length; i++) {
                if (contents[i].name == 'HeaderContent1') {
                    expect(contents[i].contentType).toBe('html-content', 'Correctly filtered contentType should be retrieved.');
                    expect(contents[i].regionIdentifier).toBe('CMSHeader', 'Correctly filtered regionIdentifier should be retrieved.');

                    contentsFound++;
                }
                if (contents[i].name == 'MainContent1 - HTML') {
                    var content = contents[i];
                    api.expectBasePropertiesAreNotNull(content);
                    expect(content.contentType).toBe('html-content', 'Correctly filtered contentType should be retrieved.');
                    expect(content.regionIdentifier).toBe('CMSMainContent', 'Correctly filtered regionIdentifier should be retrieved.');
                    expect(content.isPublished).toBe(true, 'Correctly filtered content.isPublished should be retrieved.');
                    expect(content.regionId).toBeDefinedAndNotNull('regionId should be retrieved.');

                    contentsFound++;
                }
                if (contents[i].name == 'Html widget for _0000_Page_For_Tests') {
                    expect(contents[i].contentType).toBe('html-widget', 'Correctly filtered contentType should be retrieved.');
                    expect(contents[i].regionIdentifier).toBe('CMSMainContent', 'Correctly filtered regionIdentifier should be retrieved.');

                    contentsFound++;
                }
                if (contents[i].name == 'Server Widget for for _0000_Page_For_Tests') {
                    expect(contents[i].contentType).toBe('server-widget', 'Correctly filtered contentType should be retrieved.');
                    expect(contents[i].regionIdentifier).toBe('CMSMainContent', 'Correctly filtered regionIdentifier should be retrieved.');

                    contentsFound++;
                }
            }

            expect(contentsFound).toBe(4, 'Correct count of found contents should be retrieved.');
        });
    });

    it('01009: Should get pages list, filtered by tags, using AND connector', function () {
        filterByTags('and', 1, ['IFilterByTags Page 1']);
    });
    
    it('01010: Should get pages list, filtered by tags, using OR connector', function () {
        filterByTags('or', 2, ['IFilterByTags Page 1', 'IFilterByTags Page 3']);
    });

    it('01011: Should get a list with one page, filtered by all available columns', function () {
        var url = '/bcms-api/pages/',
            result,
            ready = false;

        var data = {
            filter: {
                where: [
                    { field: 'Id', value: 'e81a87022bf4419688b4a2070081a57e' },
                    { field: 'CreatedOn', value: '2013-07-26 07:52:01.000' },
                    { field: 'CreatedBy', value: 'Better CMS test user' },
                    { field: 'LastModifiedOn', value: '2013-07-26 07:58:15.000' },
                    { field: 'LastModifiedBy', value: 'Better CMS test user' },
                    { field: 'Version', value: '4' },

                    { field: 'PageUrl', value: '/01103/01011/' },
                    { field: 'Title', value: '01011' },
                    { field: 'Description' },
                    { field: 'IsPublished', value: true },
                    { field: 'PublishedOn', value: '2013-07-26 07:58:15.000' },
                    { field: 'LayoutId', value: '9ab0bbe1e02a4a3bb842a2070082af10' },
                    { field: 'CategoryId', value: '1427628c1e7e4beb9098a2070081d2dc' },
                    { field: 'CategoryName', value: '01011' },
                    { field: 'MainImageId', value: '389e059bcc6c4336a863a2070083436c' },
                    { field: 'MainImageUrl', value: 'http://bettercms.sandbox.mvc4.local/uploads/image/6173795ceadc4b619d68005ef57c9ca8/1_1.jpg' },
                    { field: 'MainImageThumbnauilUrl', value: 'http://bettercms.sandbox.mvc4.local/uploads/image/6173795ceadc4b619d68005ef57c9ca8/t_1_1.png' },
                    { field: 'MainImageCaption', value: '01011 caption' },
                    { field: 'IsArchived', value: false },
                    { field: 'IsMasterPage', value: false }
                ]
            }
        };

        runs(function () {
            api.get(url, data, function (json) {
                result = json;
                ready = true;
            });
        });

        waitsFor(function () {
            return ready;
        }, 'The ' + url + ' timeout.');

        runs(function () {
            expect(result).toBeDefinedAndNotNull('JSON object should be retrieved.');
            expect(result.data).toBeDefinedAndNotNull('JSON data object should be retrieved.');
            expect(result.data.totalCount).toBe(1, 'Total count should be 1.');
            expect(result.data.items.length).toBe(1, 'Returned array length should be 1.');

            expect(result.data.items[0].id).toBe('e81a87022bf4419688b4a2070081a57e', 'Correctly filtered id should be retrieved.');

            // Check if model properties count didn't changed. If so - update current test filter and another tests.
            // data.filter.where.length + 3 <-- Because field: {options, tags, metadata} cannnot be filtered by
            expect(data.filter.where.length + 3).toBe(api.getCountOfProperties(result.data.items[0]), 'Retrieved result properties count should be equal to filtering parameters count.');
        });
    });
    
    it('01012: Should get a list with one page content, filtered by all available columns', function () {
        var url = '/bcms-api/pages/1b13fcadc8714ba29a20a20700846ab2/contents/',
            result,
            ready = false;

        var data = {
            filter: {
                where: [
                    { field: 'Id', value: '457c26ad2d654dc381e8a20700848027' },
                    { field: 'CreatedOn', value: '2013-07-26 08:02:25.000' },
                    { field: 'CreatedBy', value: 'Better CMS test user' },
                    { field: 'LastModifiedOn', value: '2013-07-26 08:02:25.000' },
                    { field: 'LastModifiedBy', value: 'Better CMS test user' },
                    { field: 'Version', value: '1' },

                    { field: 'ContentId', value: '60b49f2c856649c5819ea20700848027' },
                    { field: 'IsPublished', value: 'true' },
                    { field: 'Name', value: '01012' },
                    { field: 'RegionId', value: 'e3e2e7fe62df4ba683216fdcc1691d8a' },
                    { field: 'RegionIdentifier', value: 'CMSMainContent' },
                    { field: 'Order', value: '0' }
                ]
            }
        };

        runs(function () {
            api.get(url, data, function (json) {
                result = json;
                ready = true;
            });
        });

        waitsFor(function () {
            return ready;
        }, 'The ' + url + ' timeout.');

        runs(function () {
            expect(result).toBeDefinedAndNotNull('JSON object should be retrieved.');
            expect(result.data).toBeDefinedAndNotNull('JSON data object should be retrieved.');
            expect(result.data.totalCount).toBe(1, 'Total count should be 1.');
            expect(result.data.items.length).toBe(1, 'Returned array length should be 1.');

            expect(result.data.items[0].id).toBe('457c26ad2d654dc381e8a20700848027', 'Correctly filtered id should be retrieved.');

            // Check if model properties count didn't changed. If so - update current test filter and another tests.
            // data.filter.where.length + 1 <-- Because field ContentType cannnot be filtered by
            expect(data.filter.where.length + 1).toBe(api.getCountOfProperties(result.data.items[0]), 'Retrieved result properties cound should be equal to filterting parameters count.');
        });
    });

    it('01013: Should throw validation exception for RegionId/RegionIdentifier, when getting page contents.', function () {
        var url = '/bcms-api/pages/' + api.emptyGuid + '/contents/',
            result,
            ready = false,
            data = {
                regionId: api.emptyGuid,
                regionIdentifier: 'test'
            };

        runs(function () {
            api.get(url, data, null, function (response) {
                result = response.responseJSON;
                ready = true;
            });
        });

        waitsFor(function () {
            return ready;
        }, 'The ' + url + ' timeout.');

        runs(function () {
            api.expectValidationExceptionIsThrown(result, 'Data.RegionIdentifier');
        });
    });
    
    it('01014: Should throw validation exception for filterting by ContentType, when getting page contents.', function () {
        var url = '/bcms-api/pages/' + api.emptyGuid + '/contents/',
            result,
            ready = false,
            data = {
                filter: {
                    where: [{ field: 'ContentType', value: 'test' }]
                }
            };

        runs(function () {
            api.get(url, data, null, function (response) {
                result = response.responseJSON;
                ready = true;
            });
        });

        waitsFor(function () {
            return ready;
        }, 'The ' + url + ' timeout.');

        runs(function () {
            api.expectValidationExceptionIsThrown(result, 'Data');
        });
    });
    
    it('01015: Should get filtered pages list with included option values', function () {
        var url = '/bcms-api/pages/',
            result,
            ready = false;

        var data = {
            filter: {
                where: [{ field: 'Title', operation: 'StartsWith', value: '01015' }]
            },
            order: {
                by: [{field: 'Title', direction: 'asc'}]  
            },
            includeUnpublished: true,
            includeArchived: true,
            includePageOptions: true
        };

        runs(function () {
            api.get(url, data, function (json) {
                result = json;
                ready = true;
            });
        });

        waitsFor(function () {
            return ready;
        }, 'The ' + url + ' timeout.');

        runs(function () {
            expect(result).toBeDefinedAndNotNull('JSON object should be retrieved.');
            expect(result.data).toBeDefinedAndNotNull('JSON data object should be retrieved.');
            expect(result.data.totalCount).toBe(2, 'Total count should be 2.');
            expect(result.data.items.length).toBe(2, 'Returned array length should be 2.');

            expect(result.data.items[0].title).toBe('01015 - With Options', 'Correctly filtered items[0].title should be retrieved.');
            expect(result.data.items[1].title).toBe('01015 - Without Options', 'Correctly filtered items[1].title should be retrieved.');
            
            expect(result.data.items[1].options).toBeNull('Correctly filtered items[1].options should be null.');
            expect(result.data.items[0].options).toBeDefinedAndNotNull('Correctly filtered items[0].options should be defined and not null.');
            expect(result.data.items[0].options.length).toBe(3, 'Correctly filtered items[0].options.length should be 3.');
            
            expect(result.data.items[0].options[0].key).toBe('Option 1 With Default Value', 'Correctly filtered items[0].options[0].key should be retrieved.');
            expect(result.data.items[0].options[0].value).toBe('Default Value', 'Correctly filtered items[0].options[0].value should be retrieved.');
            expect(result.data.items[0].options[0].defaultValue).toBe('Default Value', 'Correctly filtered items[0].options[0].defaultValue should be retrieved.');
            expect(result.data.items[0].options[0].type).toBe('Text', 'Correctly filtered items[0].options[0].type should be retrieved.');
            
            expect(result.data.items[0].options[1].key).toBe('Option 2 Without Default Value', 'Correctly filtered items[0].options[1].key should be retrieved.');
            expect(result.data.items[0].options[1].value).toBe('Value 2', 'Correctly filtered items[0].options[1].value should be retrieved.');
            expect(result.data.items[0].options[1].defaultValue).toBeNull('Correctly filtered items[0].options[1].defaultValue should be retrieved.');
            expect(result.data.items[0].options[1].type).toBe('Text', 'Correctly filtered items[0].options[1].type should be retrieved.');
            
            expect(result.data.items[0].options[2].key).toBe('Option 3 with Custom Value', 'Correctly filtered items[0].options[2].key should be retrieved.');
            expect(result.data.items[0].options[2].value).toBe('Custom Value', 'Correctly filtered items[0].options[2].value should be retrieved.');
            expect(result.data.items[0].options[2].defaultValue).toBeNull('Correctly filtered items[0].options[2].defaultValue should be retrieved.');
            expect(result.data.items[0].options[2].type).toBe('Text', 'Correctly filtered items[0].options[2].type should be retrieved.');
        });
    });
    
    it('01016: Should throw validation exception for filtering by Options, when getting pages.', function () {
        var url = '/bcms-api/pages/',
            result,
            ready = false,
            data = {
                filter: {
                    where: [{ field: 'Options', value: 'test' }]
                }
            };

        runs(function () {
            api.get(url, data, null, function (response) {
                result = response.responseJSON;
                ready = true;
            });
        });

        waitsFor(function () {
            return ready;
        }, 'The ' + url + ' timeout.');

        runs(function () {
            api.expectValidationExceptionIsThrown(result, 'Data');
        });
    });

    it('01017: Should get list of pages with tags', function () {
        var url = '/bcms-api/pages/',
            result,
            ready = false;

        var data = {
            filter: {
                where: [{ field: 'Title', operation: 'StartsWith', value: '01017:' }]
            },
            order: {
                by: [{ field: 'Title' }]
            },
            includeUnpublished: true,
            includeArchived: true,
            includeTags: true
        };

        runs(function () {
            api.get(url, data, function (json) {
                result = json;
                ready = true;
            });
        });

        waitsFor(function () {
            return ready;
        }, 'The ' + url + ' timeout.');

        runs(function () {
            expect(result).toBeDefinedAndNotNull('JSON object should be retrieved.');
            expect(result.data).toBeDefinedAndNotNull('JSON data object should be retrieved.');
            expect(result.data.totalCount).toBe(2, 'Total count should be 3.');
            expect(result.data.items.length).toBe(2, 'Returned array length should be 3.');

            expect(result.data.items[0].title).toBe('01017:1', 'Correctly filtered items[0].title should be retrieved.');
            expect(result.data.items[1].title).toBe('01017:2', 'Correctly filtered items[1].title should be retrieved.');
            
            expect(result.data.items[0].tags).toBeDefinedAndNotNull('Correctly filtered items[0].tags should be retrieved.');
            expect(result.data.items[0].tags.length).toBe(2, 'items[0].tags should contain 2 items.');
            expect(result.data.items[0].tags[0]).toBe('01017_1', 'Correctly filtered result.data.items[0].tags[0] should be retrieved.');
            expect(result.data.items[0].tags[1]).toBe('01017_2', 'Correctly filtered result.data.items[0].tags[1] should be retrieved.');
            
            expect(result.data.items[1].tags).toBeDefinedAndNotNull('Correctly filtered items[1].tags should be retrieved.');
            expect(result.data.items[1].tags.length).toBe(3, 'items[1].tags should contain 3 items.');
            expect(result.data.items[1].tags[0]).toBe('01017_1', 'Correctly filtered result.data.items[1].tags[0] should be retrieved.');
            expect(result.data.items[1].tags[1]).toBe('01017_2', 'Correctly filtered result.data.items[1].tags[1] should be retrieved.');
            expect(result.data.items[1].tags[2]).toBe('01017_3', 'Correctly filtered result.data.items[1].tags[2] should be retrieved.');
        });
    });
    
    it('01018: Should throw validation exception for filtering by Tags, when getting pages.', function () {
        var url = '/bcms-api/pages/',
            result,
            ready = false,
            data = {
                filter: {
                    where: [{ field: 'Tags', value: 'test' }]
                }
            };

        runs(function () {
            api.get(url, data, null, function (response) {
                result = response.responseJSON;
                ready = true;
            });
        });

        waitsFor(function () {
            return ready;
        }, 'The ' + url + ' timeout.');

        runs(function () {
            api.expectValidationExceptionIsThrown(result, 'Data');
        });
    });

    it('01019: Should get a list of pages with included metadata', function () {
        var url = '/bcms-api/pages/',
            result,
            ready = false;

        var data = {
            filter: {
                where: [{ field: 'Title', operation: 'StartsWith', value: '01019' }]
            },
            order: {
                by:[{ field: 'Title' }]
            },
            take: 1,
            includeUnpublished: true,
            includeArchived: true,
            includeMetadata: true
        };

        runs(function () {
            api.get(url, data, function (json) {
                result = json;
                ready = true;
            });
        });

        waitsFor(function () {
            return ready;
        }, 'The ' + url + ' timeout.');

        runs(function () {
            expect(result).toBeDefinedAndNotNull('JSON object should be retrieved.');
            expect(result.data).toBeDefinedAndNotNull('JSON data object should be retrieved.');
            expect(result.data.totalCount).toBe(2, 'Total count should be 2.');
            expect(result.data.items.length).toBe(1, 'Returned array length should be 1.');

            expect(result.data.items[0].title).toBe('01019: Page 1', 'Correctly filtered items[0].title should be retrieved.');
            expect(result.data.items[0].metadata).toBeDefinedAndNotNull('Correctly filtered items[0].metadata should be retrieved');
            expect(result.data.items[0].metadata.metaTitle).toBe('01019-meta-title', 'Correctly filtered items[0].metadata.metaTitle should be retrieved');
            expect(result.data.items[0].metadata.metaKeywords).toBe('01019-meta-keywords', 'Correctly filtered items[0].metadata.metaKeywords should be retrieved');
            expect(result.data.items[0].metadata.metaDescription).toBe('01019-meta-description', 'Correctly filtered items[0].metadata.metaDescription should be retrieved');
            expect(result.data.items[0].metadata.useNoFollow).toBe(true, 'Correctly filtered items[0].metadata.useNoFollow should be retrieved');
            expect(result.data.items[0].metadata.useNoIndex).toBe(true, 'Correctly filtered items[0].metadata.useNoIndex should be retrieved');
            expect(result.data.items[0].metadata.useCanonicalUrl).toBe(true, 'Correctly filtered items[0].metadata.useCanonicalUrl should be retrieved');
        });
    });

    function expectPageListItemPropertiesAreNotNull(page) {
        api.expectBasePropertiesAreNotNull(page);

        expect(page.title).toBe(constants.testPageTitle, 'Correctly filtered title should be retrieved.');
        expect(page.pageUrl).toBe(constants.testPageUrl, 'Correctly filtered pageUrl should be retrieved.');
        expect(page.description).toBe('Test page', 'Correctly filtered description should be retrieved.');
        expect(page.isPublished).toBe(true, 'Correctly filtered isPublished should be retrieved.');
        expect(page.publishedOn).toBeDefinedAndNotNull('publishedOn should be retrieved.');
        expect(page.layoutId).toBeDefinedAndNotNull('layoutId should be retrieved.');
        expect(page.categoryId).toBeDefinedAndNotNull('categoryId should be retrieved.');
        expect(page.categoryName).toBe('Category for _0000_Page_For_Tests', 'Correctly filtered categoryName should be retrieved.');
        expect(page.mainImageId).toBeDefinedAndNotNull('mainImageId should be retrieved.');
        expect(page.mainImageThumbnauilUrl).toBeDefinedAndNotNull('mainImageThumbnailUrl should be retrieved.');
        expect(page.mainImageCaption).toBe("Image for _0000_Page_For_Tests", 'Correctly filtered mainImageCaption should be retrieved.');
        expect(page.isArchived).toBe(true, 'Correctly filtered isArchived should be retrieved.');
        expect(page.isMasterPage).toBe(false, 'Correctly filtered isMasterPage should be retrieved.');
    }

    function expectPagePropertiesAreNotNull(page) {
        api.expectBasePropertiesAreNotNull(page);

        expect(page.title).toBe(constants.testPageTitle, 'Correctly filtered title should be retrieved.');
        expect(page.pageUrl).toBe(constants.testPageUrl, 'Correctly filtered pageUrl should be retrieved.');
        expect(page.description).toBe('Test page', 'Correctly filtered description should be retrieved.');
        expect(page.isPublished).toBe(true, 'Correctly filtered isPublished should be retrieved.');
        expect(page.publishedOn).toBeDefinedAndNotNull('publishedOn should be retrieved.');
        expect(page.layoutId).toBeDefinedAndNotNull('layoutId should be retrieved.');
        expect(page.categoryId).toBeDefinedAndNotNull('categoryId should be retrieved.');
        expect(page.categoryName).toBe('Category for _0000_Page_For_Tests', 'Correctly filtered categoryName should be retrieved.');
        expect(page.mainImageId).toBeDefinedAndNotNull('mainImageId should be retrieved.');
        expect(page.mainImageThumbnauilUrl).toBeDefinedAndNotNull('mainImageThumbnailUrl should be retrieved.');
        expect(page.mainImageCaption).toBe("Image for _0000_Page_For_Tests", 'Correctly filtered mainImageCaption should be retrieved.');
        expect(page.isArchived).toBe(true, 'Correctly filtered isArchived should be retrieved.');
        expect(page.isMasterPage).toBe(false, 'Correctly filtered isMasterPage should be retrieved.');
    }

    function expectPagePropertiesPropertiesAreNotNull(response) {
        // Page
        var page = response.data;
        api.expectBasePropertiesAreNotNull(page);
        expect(page.title).toBe(constants.testPageTitle, 'Correctly filtered title should be retrieved.');
        expect(page.pageUrl).toBe(constants.testPageUrl, 'Correctly filtered pageUrl should be retrieved.');
        expect(page.description).toBe('Test page', 'Correctly filtered description should be retrieved.');
        expect(page.isPublished).toBe(true, 'Correctly filtered isPublished should be retrieved.');
        expect(page.publishedOn).toBeDefinedAndNotNull('publishedOn should be retrieved.');
        expect(page.layoutId).toBeDefinedAndNotNull('layoutId should be retrieved.');
        expect(page.categoryId).toBeDefinedAndNotNull('categoryId should be retrieved.');
        expect(page.mainImageId).toBeDefinedAndNotNull('mainImageId should be retrieved.');
        expect(page.featuredImageId).toBeDefinedAndNotNull('featuredImageId should be retrieved.');
        expect(page.secondaryImageId).toBeDefinedAndNotNull('secondaryImageId should be retrieved.');
        expect(page.customCss).toBe('test page custom css', 'Correctly filtered customCss should be retrieved.');
        expect(page.customJavaScript).toBe('console.log("test");', 'Correctly filtered customJavaScript should be retrieved.');
        expect(page.useCanonicalUrl).toBe(true, 'Correctly filtered useCanonicalUrl should be retrieved.');
        expect(page.useNoFollow).toBe(true, 'Correctly filtered useNoFollow should be retrieved.');
        expect(page.useNoIndex).toBe(true, 'Correctly filtered useNoIndex should be retrieved.');
        expect(page.isArchived).toBe(true, 'Correctly filtered isArchived should be retrieved.');
        expect(page.isMasterPage).toBe(false, 'Correctly filtered isMasterPage should be retrieved.');

        // layout
        var layout = response.layout;
        expect(layout).toBeDefinedAndNotNull('JSON layout object should be retrieved.');
        api.expectBasePropertiesAreNotNull(layout);
        expect(layout.name).toBe('_0001_Layout3 for _0000_Page_For_Tests', 'Correctly filtered layout.name should be retrieved.');
        expect(layout.layoutPath).toBe('~/Areas/bcms-installation/Views/Shared/DefaultLayout.cshtml', 'Correctly filtered layoutPath should be retrieved.');
        expect(layout.previewUrl).toBe('http://www.devbridge.com/Content/styles/images/responsive/logo.png', 'Correctly filtered layout.previewUrl should be retrieved.');
        
        // category
        var category = response.category;
        expect(category).toBeDefinedAndNotNull('JSON category object should be retrieved.');
        api.expectBasePropertiesAreNotNull(category);
        expect(category.name).toBe('Category for _0000_Page_For_Tests', 'Correctly filtered category.name should be retrieved.');
        
        // tags
        var tags = response.tags;
        expect(tags).toBeDefinedAndNotNull('JSON tags object should be retrieved.');
        expect(tags.length).toBe(2, 'Returned tags array length should be 2.');
        expect(tags[0].name).toBe('tag1', 'Correctly filtered tags[0].name should be retrieved.');

        api.expectBasePropertiesAreNotNull(tags[1]);
        expect(tags[1].name).toBe('tag2', 'Correctly filtered tags[1].name should be retrieved.');
        
        // images
        expectImagePropertiesAreNotNull(response.mainImage, 'mainImage');
        expectImagePropertiesAreNotNull(response.featuredImage, 'featuredImage');
        expectImagePropertiesAreNotNull(response.secondaryImage, 'secondaryImage');
        
        // meta data
        var metadata = response.metaData;
        expect(metadata).toBeDefinedAndNotNull('JSON metadata object should be retrieved.');
        expect(metadata.metaTitle).toBe('Test meta title', 'Correctly filtered metaTitle should be retrieved.');
        expect(metadata.metaKeywords).toBe('Test meta keywords', 'Correctly filtered metaKeywords should be retrieved.');
        expect(metadata.metaDescription).toBe('Test meta description', 'Correctly filtered metaDescription should be retrieved.');
        
        // options
        var options = response.pageOptions;
        expect(options).toBeDefinedAndNotNull('JSON pageOptions object should be retrieved.');
        expect(options.length).toBe(2, 'Returned pageOptions array length should be 2.');
        expect(options[0].key).toBe('Option 1', 'Correctly filtered pageOptions[0].key should be retrieved.');
        expect(options[1].key).toBe('Option 2', 'Correctly filtered pageOptions[1].key should be retrieved.');
        expect(options[0].type).toBe('Text', 'Correctly filtered pageOptions[0].type should be retrieved.');
        expect(options[1].type).toBe('Integer', 'Correctly filtered pageOptions[1].type should be retrieved.');
        expect(options[0].value).toBe('Value 1', 'Correctly filtered pageOptions[0].value should be retrieved.');
        expect(options[1].value).toBe('60', 'Correctly filtered pageOptions[1].value should be retrieved.');
        expect(options[0].defaultValue).toBe('Default 1', 'Correctly filtered pageOptions[0].defaultValue should be retrieved.');
        expect(options[1].defaultValue).toBe('50', 'Correctly filtered pageOptions[1].defaultValue should be retrieved.');
        

        // page contents
        var contents = response.pageContents;
        expect(contents).toBeDefinedAndNotNull('JSON contents object should be retrieved.');
        expect(contents.length).toBe(5, 'Returned contents array length should be 5.');

        var contentsFound = 0;
        for (var i = 0; i < contents.length; i ++)
        {
            if (contents[i].name == 'HeaderContent1') {
                expect(contents[i].contentType).toBe('html-content', 'Correctly filtered contentType should be retrieved.');
                expect(contents[i].regionIdentifier).toBe('CMSHeader', 'Correctly filtered regionIdentifier should be retrieved.');

                contentsFound++;
            }
            if (contents[i].name == 'MainContent1 - HTML') {
                var content = contents[i];
                api.expectBasePropertiesAreNotNull(content);
                expect(content.contentType).toBe('html-content', 'Correctly filtered contentType should be retrieved.');
                expect(content.regionIdentifier).toBe('CMSMainContent', 'Correctly filtered regionIdentifier should be retrieved.');
                expect(content.isPublished).toBe(true, 'Correctly filtered content.isPublished should be retrieved.');
                expect(content.regionId).toBeDefinedAndNotNull('regionId should be retrieved.');
                
                contentsFound++;
            }
            if (contents[i].name == 'Html widget for _0000_Page_For_Tests') {
                expect(contents[i].contentType).toBe('html-widget', 'Correctly filtered contentType should be retrieved.');
                expect(contents[i].regionIdentifier).toBe('CMSMainContent', 'Correctly filtered regionIdentifier should be retrieved.');

                contentsFound++;
            }
            if (contents[i].name == 'Server Widget for for _0000_Page_For_Tests') {
                expect(contents[i].contentType).toBe('server-widget', 'Correctly filtered conentType should be retrieved.');
                expect(contents[i].regionIdentifier).toBe('CMSMainContent', 'Correctly filtered regionIdentifier should be retrieved.');

                contentsFound++;
            }
        }

        expect(contentsFound).toBe(4, 'Correct count of content should be retrieved.');
    }
    
    function expectImagePropertiesAreNotNull(image, name) {
        expect(image).toBeDefinedAndNotNull('JSON ' + name + ' object should be retrieved.');
        api.expectBasePropertiesAreNotNull(image);
        
        expect(image.title).toBe('Image for _0000_Page_For_Tests', 'Correctly filtered ' + name + '.title should be retrieved.');
        expect(image.caption).toBe('Image for _0000_Page_For_Tests', 'Correctly filtered ' + name + '.caption should be retrieved.');
        expect(image.url).toBeDefinedAndNotNull('url should be retrieved.');
        expect(image.thumbnailUrl).toBeDefinedAndNotNull('thumbnailUrl should be retrieved.');
    }
    
    function filterByTags(connector, expectedCount, expectedTitles) {
        var url = '/bcms-api/pages/',
            result,
            ready = false;

        var data = {
            filter: {
                where: [{ field: 'Title', operation: 'StartsWith', value: 'IFilterByTags' }]
            },
            order: {
                by: [{ field: 'Title' }]
            },
            filterByTagsConnector: connector,
            filterByTags: ['IFilterByTags Tag 1', 'IFilterByTags Tag 2'],
            includeUnpublished: true,
            includeArchived: true
        };

        runs(function () {
            api.get(url, data, function (json) {
                result = json;
                ready = true;
            });
        });

        waitsFor(function () {
            return ready;
        }, 'The ' + url + ' timeout.');

        runs(function () {
            expect(result).toBeDefinedAndNotNull('JSON object should be retrieved.');
            expect(result.data).toBeDefinedAndNotNull('JSON data object should be retrieved.');
            expect(result.data.totalCount).toBe(expectedCount, 'Total count should be ' + expectedCount + '.');
            expect(result.data.items.length).toBe(expectedCount, 'Returned array length should be ' + expectedCount + '.');
            
            for (var i = 0; i < result.data.items.length; i++) {
                expect(result.data.items[i].title).toBe(expectedTitles[i], 'Correctly filtered title should be retrieved.');
            }
        });
    }
});