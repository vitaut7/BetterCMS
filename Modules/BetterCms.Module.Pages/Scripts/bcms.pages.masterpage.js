﻿/*jslint unparam: true, white: true, browser: true, devel: true */
/*global bettercms */

bettercms.define('bcms.pages.masterpage', ['bcms.jquery', 'bcms', 'bcms.siteSettings', 'bcms.pages', 'bcms.grid', 'bcms.pages.properties', 'bcms.messages'],
    function ($, bcms, siteSettings, page, grid, pageProperties, messages) {
        'use strict';

        var module = {},
            links = {
                loadMasterPagesListUrl: null,
            },
            globalization = {
                masterPagesTabTitle: null,
                editMasterPagePropertiesModalTitle: null
            },
            selectors = {
                searchField: '.bcms-search-query',
                searchButton: '#bcms-pages-search-btn',

                siteSettingsMasterPagesForm: "#bcms-master-pages-form",
                siteSettingsMasterPageCreateButton: '#bcms-create-page-button',
                siteSettingsPageParentRow: 'tr:first',
                siteSettingsPageTitleCell: '.bcms-page-title',
                siteSettingsPageEditButton: '.bcms-grid-item-edit-button',
                siteSettingsPageDeleteButton: '.bcms-grid-item-delete-button',
                siteSettingsPagesListFormFilterIncludeArchived: "#IncludeArchived",
                
                siteSettingsPageRowTemplate: '#bcms-pages-list-row-template',
                siteSettingsPageRowTemplateFirstRow: 'tr:first',
                siteSettingsPagesTableFirstRow: 'table.bcms-tables > tbody > tr:first',
                siteSettingsRowCells: 'td',
            };

        /**
        * Assign objects to module.
        */
        module.links = links;
        module.globalization = globalization;

        /**
        * Initializes site settings master pages list.
        */
        module.initializeMasterPagesList = function (container) {
            var dialog = siteSettings.getModalDialog(),
                form = dialog.container.find(selectors.siteSettingsMasterPagesForm);
            
            grid.bindGridForm(form, function (htmlContent, data) {
                container.html(htmlContent);
                module.initializeMasterPagesList(container);
            });
            
            form.on('submit', function (event) {
                event.preventDefault();
                searchMasterPages(form, container);
                return false;
            });
            
            form.find(selectors.searchField).keypress(function (event) {
                if (event.which == 13) {
                    bcms.stopEventPropagation(event);
                    searchMasterPages(form, container);
                }
            });

            form.find(selectors.searchButton).on('click', function () {
                searchMasterPages(form, container);
            });

            initializeListItems(container);
            
            // Select search.
            dialog.setFocus();
        };

        function searchMasterPages(form, container) {
            grid.submitGridForm(form, function (htmlContent, data) {
                container.html(htmlContent);
                module.initializeMasterPagesList(container);
                var searchInput = container.find(selectors.searchField);
                grid.focusSearchInput(searchInput);
            });
        };

        function initializeListItems(container) {
            container.find(selectors.siteSettingsMasterPageCreateButton).on('click', function () {
                addMasterPage(container);
            });

            container.find(selectors.siteSettingsRowCells).on('click', function () {
                var editButton = $(this).parents(selectors.siteSettingsPageParentRow).find(selectors.siteSettingsPageEditButton);
                if (editButton.length > 0) {
                    editMasterPage(editButton, container);
                }
            });

            container.find(selectors.siteSettingsPageTitleCell).on('click', function (event) {
                bcms.stopEventPropagation(event);
                var url = $(this).data('url');
                window.open(url);
            });

            container.find(selectors.siteSettingsPageDeleteButton).on('click', function (event) {
                bcms.stopEventPropagation(event);
                deleteMasterPage($(this), container);
            });
        };
        
        function addMasterPage(container) {
            page.openCreatePageDialog(function (data) {
                if (data.Data != null) {
                    var template = $(selectors.siteSettingsPageRowTemplate),
                        newRow = $(template.html()).find(selectors.siteSettingsPageRowTemplateFirstRow);

                    newRow.find(selectors.siteSettingsPageTitleCell).html(data.Data.Title);

                    newRow.find(selectors.siteSettingsPageTitleCell).data('url', data.Data.PageUrl);
                    newRow.find(selectors.siteSettingsPageEditButton).data('id', data.Data.PageId);
                    newRow.find(selectors.siteSettingsPageDeleteButton).data('id', data.Data.PageId);
                    newRow.find(selectors.siteSettingsPageDeleteButton).data('version', data.Data.Version);

                    newRow.insertBefore($(selectors.siteSettingsPagesTableFirstRow, container));

                    initializeListItems(newRow);

                    grid.showHideEmptyRow(container);
                }
            }, true);
        };
        
        function editMasterPage(self, container) {
            var id = self.data('id');

            pageProperties.openEditPageDialog(id, function (data) {
                if (data.Data != null) {
                    if (data.Data.IsArchived) {
                        var form = container.find(selectors.siteSettingsMasterPagesForm),
                            includeArchivedField = form.find(selectors.siteSettingsPagesListFormFilterIncludeArchived);
                        if (!includeArchivedField.is(":checked")) {
                            self.parents(selectors.siteSettingsPageParentRow).remove();
                            grid.showHideEmptyRow(container);
                            return;
                        }
                    }

                    var row = self.parents(selectors.siteSettingsPageParentRow),
                        cell = row.find(selectors.siteSettingsPageTitleCell);
                    cell.html(data.Data.Title);
                    cell.data('url', data.Data.PageUrl);
                }
            }, globalization.editMasterPagePropertiesModalTitle);
        };

        function deleteMasterPage(self, container) {
            var id = self.data('id');

            page.deletePage(id, function (json) {
                self.parents(selectors.siteSettingsPageParentRow).remove();
                messages.refreshBox(selectors.siteSettingsMasterPagesForm, json);
                grid.showHideEmptyRow(container);
            });
        };

        return module;
    });
