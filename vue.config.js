
"use strict";
const path = require("path");
 
module.exports = {
  // 路径别名
  resolve: {
    alias: {
      xyz$: path.resolve(__dirname, 'src'),
    },
  },
};

