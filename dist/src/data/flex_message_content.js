"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flex_message_contents = void 0;
exports.flex_message_contents = [
    {
        id: 'property_conditions_price',
        design: {
            type: 'carousel',
            contents: [
                {
                    type: 'bubble',
                    body: {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                            {
                                type: 'text',
                                text: '希望条件の登録',
                                weight: 'bold',
                                size: 'lg',
                                align: 'center',
                            },
                            {
                                type: 'text',
                                contents: [
                                    {
                                        type: 'span',
                                        text: '物件の総額範囲を選択してください。（右からもお選びいただけます）',
                                        size: 'md',
                                    },
                                ],
                                wrap: true,
                                margin: 'lg',
                            },
                        ],
                    },
                    footer: {
                        type: 'box',
                        layout: 'vertical',
                        spacing: 'sm',
                        contents: [
                            {
                                type: 'button',
                                style: 'primary',
                                action: {
                                    type: 'message',
                                    text: '3000～5000万円',
                                    label: '3000～5000万円',
                                },
                                color: '#F09199',
                                margin: 'none',
                                height: 'sm',
                            },
                            {
                                type: 'button',
                                style: 'primary',
                                height: 'sm',
                                action: {
                                    type: 'message',
                                    label: '5000～7500万円',
                                    text: '5000～7500万円',
                                },
                                color: '#F09199',
                                margin: 'xl',
                            },
                            {
                                type: 'button',
                                style: 'primary',
                                height: 'sm',
                                action: {
                                    type: 'message',
                                    label: '7500万～1億円',
                                    text: '7500万～1億円',
                                },
                                color: '#F09199',
                                margin: 'xl',
                            },
                        ],
                        borderWidth: 'none',
                    },
                },
                {
                    type: 'bubble',
                    footer: {
                        type: 'box',
                        layout: 'vertical',
                        spacing: 'sm',
                        contents: [
                            {
                                type: 'button',
                                style: 'primary',
                                height: 'sm',
                                action: {
                                    type: 'message',
                                    label: '1億～1億5000万円',
                                    text: '1億～1億5000万円',
                                },
                                color: '#F09199',
                                margin: 'xl',
                            },
                            {
                                type: 'button',
                                style: 'primary',
                                height: 'sm',
                                action: {
                                    type: 'message',
                                    label: '1億5000万～2億円',
                                    text: '1億5000万～2億円',
                                },
                                color: '#F09199',
                                margin: 'xl',
                            },
                            {
                                type: 'button',
                                style: 'primary',
                                height: 'sm',
                                action: {
                                    type: 'message',
                                    label: '2億円～3億円',
                                    text: '2億円～3億円',
                                },
                                color: '#F09199',
                                margin: 'xl',
                            },
                            {
                                type: 'button',
                                style: 'primary',
                                height: 'sm',
                                action: {
                                    type: 'message',
                                    label: '3億～5億円',
                                    text: '3億～5億円',
                                },
                                color: '#F09199',
                                margin: 'xl',
                            },
                            {
                                type: 'button',
                                style: 'primary',
                                height: 'sm',
                                action: {
                                    type: 'message',
                                    label: '5億円以上',
                                    text: '5億円以上',
                                },
                                color: '#F09199',
                                margin: 'xl',
                            },
                        ],
                        borderWidth: 'none',
                    },
                },
            ],
        },
    },
    {
        id: 'property_conditions_area',
        design: {
            type: 'carousel',
            contents: [
                {
                    type: 'bubble',
                    body: {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                            {
                                type: 'text',
                                text: '希望条件の登録',
                                weight: 'bold',
                                size: 'lg',
                                align: 'center',
                            },
                            {
                                type: 'text',
                                contents: [
                                    {
                                        type: 'span',
                                        text: '物件のエリアを選択してください。（右からもお選びいただけます）\n',
                                        size: 'md',
                                    },
                                ],
                                wrap: true,
                                margin: 'lg',
                            },
                            {
                                type: 'text',
                                contents: [
                                    {
                                        type: 'span',
                                        text: '※城北エリア：文京区、豊島区、板橋区、北区、荒川区、足立区\n',
                                        size: 'md',
                                    },
                                    {
                                        type: 'span',
                                        text: '城南エリア：港区、品川区、目黒区、大田区\n',
                                        size: 'md',
                                    },
                                    {
                                        type: 'span',
                                        text: '城西エリア：渋谷区、新宿区、世田谷区、中野区、杉並区、練馬区\n',
                                        size: 'md',
                                    },
                                    {
                                        type: 'span',
                                        text: '城東エリア：中央区、江東区、台東区、墨田区、葛飾区、江戸川区\n',
                                        size: 'md',
                                    },
                                ],
                                wrap: true,
                                margin: 'none',
                            },
                            {
                                type: 'box',
                                layout: 'vertical',
                                spacing: 'none',
                                contents: [
                                    {
                                        type: 'box',
                                        layout: 'vertical',
                                        contents: [
                                            {
                                                type: 'text',
                                                text: '東京',
                                                size: 'xs',
                                                weight: 'bold',
                                                decoration: 'none',
                                                offsetStart: 'lg',
                                            },
                                            {
                                                type: 'separator',
                                            },
                                        ],
                                    },
                                    {
                                        type: 'button',
                                        style: 'primary',
                                        action: {
                                            type: 'message',
                                            text: '東京都（城北エリア）',
                                            label: '東京都（城北エリア）',
                                        },
                                        color: '#F09199',
                                        margin: 'md',
                                        height: 'sm',
                                    },
                                    {
                                        type: 'button',
                                        style: 'primary',
                                        height: 'sm',
                                        action: {
                                            type: 'message',
                                            label: '東京都（城南エリア）',
                                            text: '東京都（城南エリア）',
                                        },
                                        color: '#F09199',
                                        margin: 'xl',
                                    },
                                    {
                                        type: 'button',
                                        style: 'primary',
                                        height: 'sm',
                                        action: {
                                            type: 'message',
                                            label: '東京都（城西エリア）',
                                            text: '東京都（城西エリア）',
                                        },
                                        color: '#F09199',
                                        margin: 'xl',
                                    },
                                    {
                                        type: 'button',
                                        style: 'primary',
                                        height: 'sm',
                                        action: {
                                            type: 'message',
                                            label: '東京都（城東エリア）',
                                            text: '東京都（城東エリア）',
                                        },
                                        color: '#F09199',
                                        margin: 'xl',
                                    },
                                    {
                                        type: 'button',
                                        style: 'primary',
                                        height: 'sm',
                                        action: {
                                            type: 'message',
                                            label: '東京都（23区外）',
                                            text: '東京都（23区外）',
                                        },
                                        color: '#F09199',
                                        margin: 'xl',
                                    },
                                ],
                                borderWidth: 'none',
                                margin: 'none',
                            },
                        ],
                    },
                },
                {
                    type: 'bubble',
                    footer: {
                        type: 'box',
                        layout: 'vertical',
                        spacing: 'sm',
                        contents: [
                            {
                                type: 'box',
                                layout: 'vertical',
                                contents: [
                                    {
                                        type: 'text',
                                        text: '埼玉',
                                        size: 'xs',
                                        weight: 'bold',
                                        decoration: 'none',
                                        offsetStart: 'lg',
                                    },
                                    {
                                        type: 'separator',
                                    },
                                ],
                                margin: 'sm',
                            },
                            {
                                type: 'button',
                                style: 'primary',
                                height: 'sm',
                                action: {
                                    type: 'message',
                                    label: '埼玉県（さいたま市）',
                                    text: '埼玉県（さいたま市）',
                                },
                                color: '#F09199',
                                margin: 'md',
                            },
                            {
                                type: 'button',
                                style: 'primary',
                                height: 'sm',
                                action: {
                                    type: 'message',
                                    label: '埼玉県（さいたま市以外）',
                                    text: '埼玉県（さいたま市以外）',
                                },
                                color: '#F09199',
                                margin: 'xl',
                            },
                            {
                                type: 'box',
                                layout: 'vertical',
                                contents: [
                                    {
                                        type: 'text',
                                        text: '神奈川',
                                        size: 'xs',
                                        weight: 'bold',
                                        decoration: 'none',
                                        offsetStart: 'lg',
                                    },
                                    {
                                        type: 'separator',
                                    },
                                ],
                                margin: 'lg',
                            },
                            {
                                type: 'button',
                                style: 'primary',
                                height: 'sm',
                                action: {
                                    type: 'message',
                                    label: '神奈川県（横浜市）',
                                    text: '神奈川県（横浜市）',
                                },
                                color: '#F09199',
                                margin: 'md',
                            },
                            {
                                type: 'button',
                                style: 'primary',
                                height: 'sm',
                                action: {
                                    type: 'message',
                                    label: '神奈川県（横浜市以外）',
                                    text: '神奈川県（横浜市以外）',
                                },
                                color: '#F09199',
                                margin: 'xl',
                            },
                            {
                                type: 'box',
                                layout: 'vertical',
                                contents: [
                                    {
                                        type: 'text',
                                        text: '千葉',
                                        size: 'xs',
                                        weight: 'bold',
                                        decoration: 'none',
                                        offsetStart: 'lg',
                                    },
                                    {
                                        type: 'separator',
                                    },
                                ],
                                margin: 'md',
                            },
                            {
                                type: 'button',
                                style: 'primary',
                                height: 'sm',
                                action: {
                                    type: 'message',
                                    label: '千葉県（千葉市、船橋市）',
                                    text: '千葉県（千葉市、船橋市）',
                                },
                                color: '#F09199',
                                margin: 'md',
                            },
                            {
                                type: 'button',
                                style: 'primary',
                                height: 'sm',
                                action: {
                                    type: 'message',
                                    label: '千葉県（千葉市、船橋市以外）',
                                    text: '千葉県（千葉市、船橋市以外）',
                                },
                                color: '#F09199',
                                margin: 'xl',
                            },
                        ],
                        borderWidth: 'none',
                    },
                },
            ],
        },
    },
    {
        id: 'property_conditions_yield',
        design: {
            type: 'carousel',
            contents: [
                {
                    type: 'bubble',
                    body: {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                            {
                                type: 'text',
                                text: '希望条件の登録',
                                weight: 'bold',
                                size: 'lg',
                                align: 'center',
                            },
                            {
                                type: 'text',
                                contents: [
                                    {
                                        type: 'span',
                                        text: '物件の想定利回りを選択してください。',
                                        size: 'md',
                                    },
                                ],
                                wrap: true,
                                margin: 'lg',
                            },
                        ],
                    },
                    footer: {
                        type: 'box',
                        layout: 'vertical',
                        spacing: 'sm',
                        contents: [
                            {
                                type: 'button',
                                style: 'primary',
                                action: {
                                    type: 'message',
                                    text: '4％～（RC造 築浅中心）',
                                    label: '4％～（RC造 築浅中心）',
                                },
                                color: '#F09199',
                                margin: 'none',
                                height: 'sm',
                            },
                            {
                                type: 'button',
                                style: 'primary',
                                height: 'sm',
                                action: {
                                    type: 'message',
                                    label: '5％～（RC/重量鉄骨造 築浅中心）',
                                    text: '5％～（RC/重量鉄骨造 築浅中心）',
                                },
                                color: '#F09199',
                                margin: 'xl',
                            },
                            {
                                type: 'button',
                                style: 'primary',
                                height: 'sm',
                                action: {
                                    type: 'message',
                                    label: '6％～（重量/軽量鉄骨造 中心）',
                                    text: '6％～（重量/軽量鉄骨造 中心）',
                                },
                                color: '#F09199',
                                margin: 'xl',
                            },
                            {
                                type: 'button',
                                style: 'primary',
                                height: 'sm',
                                action: {
                                    type: 'message',
                                    label: '7％～（軽量鉄骨造/木造 中心）',
                                    text: '7％～（軽量鉄骨造/木造 中心）',
                                },
                                color: '#F09199',
                                margin: 'xl',
                            },
                            {
                                type: 'button',
                                style: 'primary',
                                height: 'sm',
                                action: {
                                    type: 'message',
                                    label: '8％～（木造/耐用年数越え）',
                                    text: '8％～（木造/耐用年数越え）',
                                },
                                color: '#F09199',
                                margin: 'xl',
                            },
                        ],
                        borderWidth: 'none',
                    },
                },
            ],
        },
    },
    {
        id: 'externalProperty_share_method',
        /* TODO 画像を公式LINEに送れるようにする！
        "type": "uri",
        "label": "スクリーンショットを送る",
        "uri": "https://line.me/R/nv/cameraRoll/multi"
        */
        design: {
            type: 'bubble',
            body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                    {
                        type: 'text',
                        text: '他社提案物件を問い合わせる',
                        weight: 'bold',
                        size: 'lg',
                        align: 'center',
                    },
                    {
                        type: 'text',
                        contents: [
                            {
                                type: 'span',
                                text: '他社から提示された仲介手数料の\n',
                            },
                            {
                                type: 'span',
                                text: '『 半額 』',
                                weight: 'bold',
                            },
                            {
                                type: 'span',
                                text: 'でお受けいたします。',
                            },
                        ],
                        wrap: true,
                        margin: 'lg',
                    },
                    {
                        type: 'text',
                        text: '（スーモ、ホームズ、カナリーなど）',
                        size: 'xs',
                    },
                ],
            },
            footer: {
                type: 'box',
                layout: 'vertical',
                spacing: 'sm',
                contents: [
                    {
                        type: 'button',
                        style: 'primary',
                        action: {
                            type: 'message',
                            label: 'URLを送る',
                            text: 'URLを送る',
                        },
                        color: '#F09199',
                        margin: 'none',
                        height: 'sm',
                    },
                    {
                        type: 'button',
                        style: 'primary',
                        height: 'sm',
                        action: {
                            type: 'message',
                            label: 'PDFファイルを送る',
                            text: 'PDFファイルを送る',
                        },
                        color: '#F09199',
                        margin: 'xl',
                    },
                    {
                        type: 'button',
                        style: 'primary',
                        height: 'sm',
                        action: {
                            type: 'message',
                            label: '画像を送る',
                            text: '画像を送る',
                        },
                        color: '#F09199',
                        margin: 'xl',
                    },
                ],
                borderWidth: 'none',
            },
        },
    },
    {
        id: 'change_user_property_by_item',
        design: {
            type: 'carousel',
            contents: [
                {
                    type: 'bubble',
                    body: {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                            {
                                type: 'box',
                                layout: 'horizontal',
                                spacing: 'none',
                                contents: [
                                    {
                                        type: 'button',
                                        style: 'primary',
                                        height: 'sm',
                                        action: {
                                            type: 'message',
                                            label: '氏名',
                                            text: '氏名',
                                        },
                                        color: '#F09199',
                                        margin: 'none',
                                    },
                                    {
                                        type: 'button',
                                        style: 'primary',
                                        height: 'sm',
                                        action: {
                                            type: 'message',
                                            label: '氏名（カナ）',
                                            text: '氏名（カナ）',
                                        },
                                        color: '#F09199',
                                        margin: 'sm',
                                    },
                                ],
                                borderWidth: 'none',
                                margin: 'none',
                            },
                            {
                                type: 'box',
                                layout: 'horizontal',
                                spacing: 'xs',
                                contents: [
                                    {
                                        type: 'button',
                                        style: 'primary',
                                        height: 'sm',
                                        action: {
                                            type: 'message',
                                            label: '郵便番号',
                                            text: '郵便番号',
                                        },
                                        color: '#F09199',
                                        margin: 'none',
                                    },
                                    {
                                        type: 'button',
                                        style: 'primary',
                                        height: 'sm',
                                        action: {
                                            type: 'message',
                                            label: '住所',
                                            text: '住所',
                                        },
                                        color: '#F09199',
                                        margin: 'sm',
                                    },
                                ],
                                borderWidth: 'none',
                                margin: 'xl',
                            },
                            {
                                type: 'box',
                                layout: 'horizontal',
                                spacing: 'xs',
                                contents: [
                                    {
                                        type: 'button',
                                        style: 'primary',
                                        height: 'sm',
                                        action: {
                                            type: 'message',
                                            label: '住居区分',
                                            text: '住居区分',
                                        },
                                        color: '#F09199',
                                        margin: 'none',
                                    },
                                    {
                                        type: 'button',
                                        style: 'primary',
                                        height: 'sm',
                                        action: {
                                            type: 'message',
                                            label: 'メールアドレス',
                                            text: '5000～7500万円',
                                        },
                                        color: '#F09199',
                                        margin: 'sm',
                                        adjustMode: 'shrink-to-fit',
                                    },
                                ],
                                borderWidth: 'none',
                                margin: 'xl',
                            },
                            {
                                type: 'box',
                                layout: 'horizontal',
                                spacing: 'xs',
                                contents: [
                                    {
                                        type: 'button',
                                        style: 'primary',
                                        height: 'sm',
                                        action: {
                                            type: 'message',
                                            label: '電話番号',
                                            text: '電話番号',
                                        },
                                        color: '#F09199',
                                        margin: 'none',
                                    },
                                    {
                                        type: 'button',
                                        style: 'primary',
                                        height: 'sm',
                                        action: {
                                            type: 'message',
                                            label: '勤務先名',
                                            text: '勤務先名',
                                        },
                                        color: '#F09199',
                                        margin: 'sm',
                                    },
                                ],
                                borderWidth: 'none',
                                margin: 'xl',
                            },
                            {
                                type: 'box',
                                layout: 'horizontal',
                                spacing: 'xs',
                                contents: [
                                    {
                                        type: 'button',
                                        style: 'primary',
                                        height: 'sm',
                                        action: {
                                            type: 'message',
                                            label: '勤務先住所',
                                            text: '勤務先住所',
                                        },
                                        color: '#F09199',
                                        margin: 'none',
                                    },
                                    {
                                        type: 'button',
                                        style: 'primary',
                                        height: 'sm',
                                        action: {
                                            type: 'message',
                                            label: '役職',
                                            text: '役職',
                                        },
                                        color: '#F09199',
                                        margin: 'sm',
                                    },
                                ],
                                borderWidth: 'none',
                                margin: 'xl',
                            },
                        ],
                    },
                },
                {
                    type: 'bubble',
                    body: {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                            {
                                type: 'box',
                                layout: 'horizontal',
                                spacing: 'none',
                                contents: [
                                    {
                                        type: 'button',
                                        style: 'primary',
                                        height: 'sm',
                                        action: {
                                            type: 'message',
                                            label: '職種',
                                            text: '職種',
                                        },
                                        color: '#F09199',
                                        margin: 'none',
                                    },
                                    {
                                        type: 'button',
                                        style: 'primary',
                                        height: 'sm',
                                        action: {
                                            type: 'message',
                                            label: '勤続年数',
                                            text: '勤続年数',
                                        },
                                        color: '#F09199',
                                        margin: 'sm',
                                    },
                                ],
                                borderWidth: 'none',
                                margin: 'none',
                            },
                            {
                                type: 'box',
                                layout: 'horizontal',
                                contents: [
                                    {
                                        type: 'text',
                                        text: '額面給与額',
                                        margin: 'none',
                                        weight: 'bold',
                                    },
                                ],
                                margin: 'sm',
                            },
                            {
                                type: 'box',
                                layout: 'horizontal',
                                spacing: 'xs',
                                contents: [
                                    {
                                        type: 'button',
                                        style: 'primary',
                                        action: {
                                            type: 'message',
                                            label: 'R5年',
                                            text: 'R5年 額面給与',
                                        },
                                        color: '#F09199',
                                        margin: 'none',
                                        adjustMode: 'shrink-to-fit',
                                        height: 'sm',
                                    },
                                    {
                                        type: 'button',
                                        style: 'primary',
                                        height: 'sm',
                                        action: {
                                            type: 'message',
                                            label: 'R4年',
                                            text: 'R4年 額面給与',
                                        },
                                        color: '#F09199',
                                        margin: 'sm',
                                        adjustMode: 'shrink-to-fit',
                                    },
                                    {
                                        type: 'button',
                                        style: 'primary',
                                        height: 'sm',
                                        action: {
                                            type: 'message',
                                            label: 'R3年',
                                            text: 'R3年 額面給与',
                                        },
                                        color: '#F09199',
                                        margin: 'sm',
                                        adjustMode: 'shrink-to-fit',
                                    },
                                ],
                                borderWidth: 'none',
                                margin: 'none',
                            },
                            {
                                type: 'box',
                                layout: 'horizontal',
                                spacing: 'xs',
                                contents: [
                                    {
                                        type: 'button',
                                        style: 'primary',
                                        height: 'sm',
                                        action: {
                                            type: 'message',
                                            label: '配偶者の有無',
                                            text: '配偶者の有無',
                                        },
                                        color: '#F09199',
                                        margin: 'none',
                                        adjustMode: 'shrink-to-fit',
                                    },
                                    {
                                        type: 'button',
                                        style: 'primary',
                                        height: 'sm',
                                        action: {
                                            type: 'message',
                                            label: '子供の人数',
                                            text: '子供の人数',
                                        },
                                        color: '#F09199',
                                        margin: 'sm',
                                        adjustMode: 'shrink-to-fit',
                                    },
                                ],
                                borderWidth: 'none',
                                margin: 'lg',
                            },
                            {
                                type: 'box',
                                layout: 'horizontal',
                                spacing: 'xs',
                                contents: [
                                    {
                                        type: 'button',
                                        style: 'primary',
                                        height: 'sm',
                                        action: {
                                            type: 'message',
                                            label: '借入総額',
                                            text: '借入総額',
                                        },
                                        color: '#F09199',
                                        margin: 'none',
                                    },
                                    {
                                        type: 'button',
                                        style: 'primary',
                                        height: 'sm',
                                        action: {
                                            type: 'message',
                                            label: '預金総額',
                                            text: '預金総額',
                                        },
                                        color: '#F09199',
                                        margin: 'sm',
                                    },
                                ],
                                borderWidth: 'none',
                                margin: 'lg',
                            },
                            {
                                type: 'box',
                                layout: 'horizontal',
                                spacing: 'xs',
                                contents: [
                                    {
                                        type: 'button',
                                        style: 'primary',
                                        height: 'sm',
                                        action: {
                                            type: 'message',
                                            label: 'その他資産',
                                            text: 'その他資産',
                                        },
                                        color: '#F09199',
                                        margin: 'none',
                                    },
                                    {
                                        type: 'button',
                                        style: 'primary',
                                        height: 'sm',
                                        action: {
                                            type: 'message',
                                            label: '購入名義',
                                            text: '購入名義',
                                        },
                                        color: '#F09199',
                                        margin: 'sm',
                                    },
                                ],
                                borderWidth: 'none',
                                margin: 'lg',
                            },
                        ],
                    },
                },
            ],
        },
    },
];
