//whatever function you think is necessary

//method to send the request to set a rich menu to a user
function funcname(user_line_id, richmenu_id) {}

const rich_menus = [
    {
        id: 'invest_property_searching',
        areas: [
            {
                id: 'user_page',
                action: {
                    type: 'uri',
                    label: '専用ページ',
                    uri: 'https://www.google.com', //temporary, will be replaced by the user's page after the logic is implemented
                },
            },
            {
                id: 'basic_info',
                action: {
                    type: 'message',
                    label: '基本情報',
                    text: '基本情報',
                },
            },
            {
                id: 'property_searchCondition',
                action: {
                    type: 'message',
                    label: 'ご希望の物件',
                    text: 'ご希望の物件',
                },
            },
            {
                id: 'ask_external_properties',
                action: {
                    type: 'message',
                    label: '他サイトで見た物件を問い合わせる',
                    text: '他サイトで見た物件を問い合わせる',
                },
            },
            {
                id: 'message_to_agent',
                action: {
                    type: 'message',
                    label: '担当者にメッセージ',
                    text: '担当者にメッセージ',
                },
            },
        ],
    },
];
