(function () {
    'use strict';

    angular
        .module('app.components.composite')
        .controller('CompositeController', CompositeController);

    /* @ngInject */
    function CompositeController(UserService) {
        var vm = this;
        // vm.data = {
        //     title: 'I am title',
        //     header: 'I am header',
        //     body: 'Lily'
        // };


        vm.data = [];

        vm.addParagraph = function ($index) {
            console.log($index);
            if ($index >= -1 && $index < vm.data.length) {
                vm.data.splice($index + 1, 0, {
                    type: 'paragraph',
                    texts: [],
                    options: {

                    }
                })
            }
        }

        vm.addPageBreak = function ($index) {
            if ($index >= -1 && $index < vm.data.length) {
                vm.data.splice($index + 1, 0, {
                    type: 'pagebreak',
                    texts: [],
                    options: {

                    }
                })
            }
        }

        vm.addText = function (paragraph, $index) {
            if ($index >= -1 && $index < paragraph.texts.length) {
                paragraph.texts.splice($index + 1, 0, {
                    type: 'text',
                    text: '',
                    options: {
                        bold: false,
                        link: false,
                        url: 'http://',
                        underline: false,
                        border: '',
                        boderSize: 12,
                        borderColor: ''
                    }
                })
            }
        }

        vm.removeText = function (paragraph, $index) {
            if ($index >= 0 && $index < paragraph.texts.length) {
                paragraph.texts.splice($index, 1);
            }
        }

        vm.addLineBreak = function (paragraph, $index) {
            if ($index >= -1 && $index < paragraph.texts.length) {
                paragraph.texts.splice($index + 1, 0, {
                    type: 'linebreak',
                    text: '',
                    options: {}
                })
            }
        }

        vm.removeParagraph = function ($index) {
            if ($index >= 0 && $index < vm.data.length) {
                vm.data.splice($index, 1);
            }
        }

        vm.addParagraph(-1);

        vm.loadDemoData = function () {
            vm.data = [
                {
                    type: 'paragraph', //'pagebreak'
                    texts: [
                        {
                            type: 'text', // 'linebreak'
                            text: 'Tensions between the Trump administration and California leaders are escalating into an all-out political war, as Gov. Jerry Brown and his allies vow to fight the president tooth-and-nail over everything from sanctuary cities to environmental policies. ',
                            options: {
                                bold: false,
                                link: false,
                                underline: false
                            }
                        }

                    ],
                    options: {
                        align: 'left'
                    }
                },
                {
                    type: 'paragraph', //'pagebreak'
                    texts: [
                        {
                            type: 'text', // 'linebreak'
                            text: 'President Trump fired the latest shot when he threatened to “defund” unspecified programs over California’s push to become a “sanctuary state.” In an interview with ',
                            options: {
                                bold: false,
                                link: false,
                                underline: false
                            }
                        },
                        {
                            type: 'text', // 'linebreak'
                            text: ' Fox News’ Bill O’Reilly',
                            options: {
                                bold: false,
                                link: true,
                                url: 'http://www.foxnews.com/politics/2017/02/06/trump-says-mexican-president-has-got-problem-with-cartels-slams-california-sanctuary-state-push.html',
                                underline: true,
                                border: 'dotted',
                                boderSize: 12,
                                borderColor: '88CCFF',
                            }
                        },
                        {
                            type: 'text', // 'linebreak'
                            text: ', he criticized California lawmakers for pursuing a statewide law to limit local law enforcement from cooperating with federal immigration authorities.',
                            options: {
                                bold: false,
                                link: false,
                                underline: false
                            }
                        }
                    ],
                    options: {
                        align: 'left'
                    }
                }
            ]
        }




        vm.generateDocument = function () {
            UserService.generateDocument(vm.data).then(function (res) {
                console.log(res);
            });
        }
    }
})();