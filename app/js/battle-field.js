'use strict';

app.battleField = (function () {
    //marks of cells and mines on field
    var elements = {
        emptyCell: 0,
        bomb: -1
    };

    var createEmptyField = function (width, height) {
        var emptyField = [],
            i = 0;
        for (i; i < height; i++) {
            emptyField.push(new Array(width));
            for (var j = 0; j < emptyField[0].length; j++) {
                emptyField[i][j] = {
                    value: elements.emptyCell,
                    opened: false
                };
            }
        }
        return emptyField;
    };

    var placeBombs = function (arr, bombsQuantity) {
        var bombs = bombsQuantity;

        function randomHeight(height) {
            return Math.floor(Math.random() * height);
        }

        function randomWidth(width) {
            return Math.floor(Math.random() * width)
        }

        while (bombs != 0) {
            var column = randomWidth(arr[0].length),
                row = randomHeight(arr.length);
            while (arr[row][column].value != elements.emptyCell) {
                column = randomWidth(arr[0].length);
                row = randomHeight(arr.length);
            }
            arr[row][column] = {
                value: elements.bomb,
                opened: false,
                marked: false
            };
            bombs--;
        }
    };

    var isValidCoordinates = function (row, column, arr) {
        if (row < 0 || column < 0 || row >= arr.length || column >= arr[0].length || arr[row][column].value == elements.bomb) {
            return false;
        }
        return true;
    }
    //Place numbers of bombs in cells near each bombs
    var placeNumbers = function (arr) {
        for (var row = 0; row < arr.length; row++) {
            for (var column = 0; column < arr[0].length; column++) {
                if (arr[row][column].value == elements.bomb) {

                    if (isValidCoordinates(row - 1, column - 1, arr)) {
                        arr[row - 1][column - 1].value++;
                    }
                    if (isValidCoordinates(row - 1, column, arr)) {
                        arr[row - 1][column].value++;
                    }
                    if (isValidCoordinates(row - 1, column + 1, arr)) {
                        arr[row - 1][column + 1].value++;
                    }
                    if (isValidCoordinates(row, column - 1, arr)) {
                        arr[row][column - 1].value++;
                    }
                    if (isValidCoordinates(row, column + 1, arr)) {
                        arr[row][column + 1].value++;
                    }
                    if (isValidCoordinates(row + 1, column - 1, arr)) {
                        arr[row + 1][column - 1].value++;
                    }
                    if (isValidCoordinates(row + 1, column, arr)) {
                        arr[row + 1][column].value++;
                    }
                    if (isValidCoordinates(row + 1, column + 1, arr)) {
                        arr[row + 1][column + 1].value++;
                    }
                }
            }
        }
    };

    return {
        field: [],
        fill: function (level) {
            var localSettings = {};
            if (level === 'newbie') {
                localSettings.width = 9;
                localSettings.height = 9;
                localSettings.bombsQuantity = 10;
            } else if (level === 'expierienced') {
                localSettings.width = 16;
                localSettings.height = 16;
                localSettings.bombsQuantity = 40;
            } else if (level === 'master') {
                localSettings.width = 32;
                localSettings.height = 16;
                localSettings.bombsQuantity = 99;
            }
            this.field = createEmptyField(localSettings.width, localSettings.height);
            placeBombs(this.field, localSettings.bombsQuantity);
            placeNumbers(this.field);
            mediator.publish(app.eventNames.battleFieldCreatedEvent, null);
        },
        clear: function () {
            field = [];
        },
        getWidth: function () {
            return this.field[0].length;
        },
        getHeight: function () {
            return this.field.length;
        },
        open: function (row, column) {
            this.field[row][column].opened = true;
            if (this.field[row][column].value == elements.bomb) {
                mediator.publish(app.eventNames.bombExplodedEvent, null);
            }
        },
        mark: function (row, column) {
            this.field[row][column].opened = false;
            this.field[row][column].marked = true;
        },
        unmark: function (row, column) {
            this.field[row][column].opened = false;
            this.field[row][column].marked = false;
        },
        getCell: function (row, column) {
            return this.field[row][column];
        },
        checkOnWin: function () {
            for (var row = 0; row < this.field.length; row++) {
                for (var column = 0; column < this.field[0].length; column++) {
                    var cell = this.field[row][column];
                    if (cell.value != elements.bomb && !cell.opened)
                        return false;
                }
            }
            mediator.publish(app.eventNames.gameWinEvent, null);
            return true;
        },
        isBombOn: function (row, column){
            return this.field[row][column].value == elements.bomb;
        }
    }

})();