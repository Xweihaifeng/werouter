
//const apiUrl = 'http://api.wezchina.loc/';
const apiUrl = 'http://apitest.wezchina.com/';

const CMS_CHANNELS = apiUrl + 'cms/channels';    /* 查询所有频道 */
const CMS_CATEGORIES = apiUrl + 'cms/categories/';    /* 查询类目详情 */
const CMS_CONTENTS_HOT = apiUrl + 'cms/contents?channel_id=702cfc30-7d7f-11e7-b9f7-e1b5a9d40f8d&is_hot=1&limit=3';    /* 查询热点新闻 */
const CMS_CHANNEL_CATEGORIES = apiUrl + 'cms/channel_categories?channel=702cfc30-7d7f-11e7-b9f7-e1b5a9d40f8d';
const CMS_CONTENTS = apiUrl + 'cms/contents?channel_id=702cfc30-7d7f-11e7-b9f7-e1b5a9d40f8d&limit=10&page=';
const CMS_DETAIL_CONTENTS_CATE_ID = apiUrl + 'cms/contents?cate_id=';
const CMS_CONTENTS_PRAISE = apiUrl + 'cms/contents/praise';
const CMS_CONTENTS_PRAISE_USER = apiUrl + 'cms/contents/';
const CMS_DETAIL = apiUrl + 'cms/detail/';
const CMS_DETAIL_QRCODE = apiUrl + 'cms/qrcode?size=150&text=';
const CMS_CHANNELS_DOMAIN_QUERY = apiUrl + 'cms/channels/domain_query/';