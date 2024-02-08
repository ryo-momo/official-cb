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
];
