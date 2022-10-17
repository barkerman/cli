// @flow
'use strict'

const config = {
  API_URL: process.env.API_URL || 'https://content.civicplus.com/',

  // ENGAGE 6
  CIVICPLUS_API_URL: process.env.CIVICPLUS_API_URL || 'https://content.civicplus.com/',
  CIVICPLUS_HCMS_SHORTURL: process.env.CIVICPLUS_HCMS_SHORTURL || 'mt-butte-silverbow', // required
  CIVICPLUS_CLIENT_ID: process.env.CIVICPLUS_CLIENT_ID || 'mt-butte-silverbow:civicoptimize', // required
  CIVICPLUS_CLIENT_SECRET: process.env.CIVICPLUS_CLIENT_SECRET || 'zcxp3urxukre9rf1ovvyg1sp9vueqzfukrl0sxygpx8x', // required
  CIVICPLUS_PERMISSION_SET_ID: process.env.CIVICPLUS_PERMISSION_SET_ID || '',
  CIVICPLUS_CONTENT_TYPE: process.env.CIVICPLUS_CONTENT_TYPE || 'vehicle-database', // required
  CIVICPLUS_CONTENT_FIELD: process.env.CIVICPLUS_CONTENT_FIELD || 'licensePlateNumber', // required

  // PRODUCTIVITY
  PRODUCTIVITY_FORM_ID: parseInt(process.env.PRODUCTIVITY_FORM_ID) || 0,
  PRODUCTIVITY_FORMS_ACCESS_KEY: process.env.PRODUCTIVITY_FORMS_ACCESS_KEY,
  PRODUCTIVITY_FORMS_SECRET_KEY: process.env.PRODUCTIVITY_FORMS_SECRET_KEY,
  PRODUCTIVITY_API_CALLBACK_SECRET: process.env.PRODUCTIVITY_API_CALLBACK_SECRET,
}

module.exports = config
