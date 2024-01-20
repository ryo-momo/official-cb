module.exports = {
    surveys: [
        {
            id: "basic_info",
            questions: [
                {
                    id: "name_primary",
                    text: "お客様のフルネームをお教えください。",
                    type: "text",
                    next: "name_kana"
                },
                {
                    id: "name_kana",
                    text: "お客様のフルネームをカタカナでお教えください。",
                    type: "text",
                    next: "postal_code"
                },
                {
                    id: "postal_code",
                    text: "お客様のお住まいの郵便番号をお教えください。",
                    type: "text",
                    next: "address"
                },
                {
                    id: "address",
                    text: "お客様の住所をお教えください。",
                    type: "text",
                    next: "residence_category"
                },
                {
                    id: "residence_category",
                    text: "お客様の住居区分を以下から選択してください。",
                    type: "single-choice",
                    options: [
                        {
                            id: 1,
                            text: "賃貸"
                        },
                        {
                            id: 2,
                            text: "持ち家"
                        },
                        {
                            id: 3,
                            text: "社宅"
                        }
                    ],
                    next: {
                        1: "email_address",
                        2: "email_address",
                        3: "email_address"
                    }
                },
                {
                    id: "email_address",
                    text: "お客様のEメールアドレスをお教えください。",
                    type: "text",
                    next: "residence_category"
                },
                {
                    id: "phone_number",
                    text: "お客様の電話番号をお教えください。",
                    type: "text",
                    next: "workplace_name"
                },
                {
                    id: "workplace_name",
                    text: "お客様の職業についてお聞きします。まず、勤務先会社名をお教えください。",
                    type: "text",
                    next: "workplace_address"
                },
                {
                    id: "workplace_address",
                    text: "お客様の勤務先住所をお教えください。",
                    type: "text",
                    next: "department"
                },
                {
                    id: "department",
                    text: "お客様の役職をお教えください。",
                    type: "text",
                    next: "job_category"
                },
                {
                    id: "job_category",
                    text: "お客様の職種をお教えください。",
                    type: "text",
                    next: "length_of_service"
                },
                {
                    id: "years_of_service",
                    text: "お客様の現在の勤続年数をお教えください。",
                    type: "text",
                    next: "gross_salary-1"
                },
                {
                    id: "gross_salary_-1",
                    text: "お客様の過去三年の額面給与額をお聞きします。\nまず、令和{reiwa_year - 1}年度の額面給与額（万円）をお教えください。",
                    type: "text",
                    next: "gross_salary_-2"
                },
                {
                    id: "gross_salary_-2",
                    text: "次に、令和{reiwa_year - 2}年度の額面給与額（万円）をお教えください。",
                    type: "text",
                    next: "gross_salary_-3"
                },
                {
                    id: "gross_salary_-3",
                    text: "最後に、令和{reiwa_year - 3}年度の額面給与額（万円）をお教えください。",
                    type: "text",
                    next: "family_structure_spouse"
                },
                {
                    id: "family_structure_spouse",
                    text: "次に、家族構成についてお聞きします。現在、配偶者はいらっしゃいますか？",
                    type: "single-choice",
                    options: [
                        {
                            id: 1,
                            text: "はい"
                        },
                        {
                            id: 2,
                            text: "いいえ"
                        }
                    ],
                    next: {
                        1: "family_structure_children",
                        2: "family_structure_children"
                    }
                },
                {
                    id: "family_structure_children",
                    text: "お子様の人数をお教えください。",
                    type: "text",
                    next: "borrowed_money"
                },
                {
                    id: "borrowed_money",
                    text: "お客様の保有する資産についてお聞きします。まず、現在の借入総額（万円）をお教えください。",
                    type: "text",
                    next: "deposit"
                },
                {
                    id: "deposit",
                    text: "現在の預金総額（万円）をお教えください。",
                    type: "text",
                    next: "other_assets"
                },
                {
                    id: "other_assets",
                    text: "その他の資産総額（万円）をお教えください。",
                    type: "text",
                    next: ""
                },
                {
                    id: "purchaser_category",
                    text: "最後に、不動産を購入される際の名義を以下からお選びください。",
                    type: "single-choice",
                    options: [
                        {
                            id: 1,
                            text: "個人"
                        },
                        {
                            id: 2,
                            text: "新設法人"
                        },
                        {
                            id: 3,
                            text: "既存法人"
                        }
                    ],
                    next: {
                        1: "end",
                        2: "end",
                        3: "end"
                    }
                }
            ]
        },
        {
            id: "property_conditions",
            questions: [
                {
                    id: "price",
                    type: "single-choice",
                    design: {
                        type: "carousel",
                        contents: [
                            {
                                type: "bubble",
                                body: {
                                    type: "box",
                                    layout: "vertical",
                                    contents: [
                                        {
                                            type: "text",
                                            text: "希望条件の登録",
                                            weight: "bold",
                                            size: "lg",
                                            align: "center"
                                        },
                                        {
                                            type: "text",
                                            contents: [
                                                {
                                                    type: "span",
                                                    text: "物件の総額範囲を選択してください。（右からもお選びいただけます）",
                                                    size: "md"
                                                }
                                            ],
                                            wrap: true,
                                            margin: "lg"
                                        }
                                    ]
                                },
                                footer: {
                                    type: "box",
                                    layout: "vertical",
                                    spacing: "sm",
                                    contents: [
                                        {
                                            type: "button",
                                            style: "primary",
                                            action: {
                                                type: "message",
                                                text: "3000～5000万円",
                                                label: "3000～5000万円"
                                            },
                                            color: "#F09199",
                                            margin: "none",
                                            height: "sm"
                                        },
                                        {
                                            type: "button",
                                            style: "primary",
                                            height: "sm",
                                            action: {
                                                type: "message",
                                                label: "5000～7500万円",
                                                text: "5000～7500万円"
                                            },
                                            color: "#F09199",
                                            margin: "xl"
                                        },
                                        {
                                            type: "button",
                                            style: "primary",
                                            height: "sm",
                                            action: {
                                                type: "message",
                                                label: "7500万～1億円",
                                                text: "7500万～1億円"
                                            },
                                            color: "#F09199",
                                            margin: "xl"
                                        }
                                    ],
                                    borderWidth: "none"
                                }
                            },
                            {
                                type: "bubble",
                                footer: {
                                    type: "box",
                                    layout: "vertical",
                                    spacing: "sm",
                                    contents: [
                                        {
                                            type: "button",
                                            style: "primary",
                                            height: "sm",
                                            action: {
                                                type: "message",
                                                label: "1億～1億5000万円",
                                                text: "1億～1億5000万円"
                                            },
                                            color: "#F09199",
                                            margin: "xl"
                                        },
                                        {
                                            type: "button",
                                            style: "primary",
                                            height: "sm",
                                            action: {
                                                type: "message",
                                                label: "1億5000万～2億円",
                                                text: "1億5000万～2億円"
                                            },
                                            color: "#F09199",
                                            margin: "xl"
                                        },
                                        {
                                            type: "button",
                                            style: "primary",
                                            height: "sm",
                                            action: {
                                                type: "message",
                                                label: "2億円～3億円",
                                                text: "2億円～3億円"
                                            },
                                            color: "#F09199",
                                            margin: "xl"
                                        },
                                        {
                                            type: "button",
                                            style: "primary",
                                            height: "sm",
                                            action: {
                                                type: "message",
                                                label: "3億～5億円",
                                                text: "3億～5億円"
                                            },
                                            color: "#F09199",
                                            margin: "xl"
                                        },
                                        {
                                            type: "button",
                                            style: "primary",
                                            height: "sm",
                                            action: {
                                                type: "message",
                                                label: "5億円以上",
                                                text: "5億円以上"
                                            },
                                            color: "#F09199",
                                            margin: "xl"
                                        }
                                    ],
                                    borderWidth: "none"
                                }
                            }
                        ]
                    },
                    options: [
                        {
                            id: 1,
                            text: "3000～5000万円"
                        },
                        {
                            id: 2,
                            text: "5000～7500万円"
                        },
                        {
                            id: 3,
                            text: "7500万～1億円"
                        },
                        {
                            id: 4,
                            text: "1億～1億5000万円"
                        },
                        {
                            id: 5,
                            text: "1億5000万～2億円"
                        },
                        {
                            id: 6,
                            text: "2億円～3億円"
                        },
                        {
                            id: 7,
                            text: "3億～5億円"
                        },
                        {
                            id: 8,
                            text: "5億円以上"
                        }
                    ],
                    next: {
                        1: "target",
                        2: "target",
                        3: "target",
                        4: "target",
                        5: "target",
                        6: "target",
                        7: "target",
                        8: "target"
                    }
                },
                {
                    id: "target",
                    type: "single-choice",
                    options: [
                        {
                            id: 1,
                            text: "単身者/カップル向け（1R,1K,1DK,1LDK中心）"
                        },
                        {
                            id: 2,
                            text: "ファミリー向け（2DK以上）"
                        }
                    ],
                    next: {
                        1: "area",
                        2: "area"
                    }
                },
                {
                    id: "area",
                    type: "single-choice",
                    design: {
                        type: "carousel",
                        contents: [
                            {
                                type: "bubble",
                                body: {
                                    type: "box",
                                    layout: "vertical",
                                    contents: [
                                        {
                                            type: "text",
                                            text: "希望条件の登録",
                                            weight: "bold",
                                            size: "lg",
                                            align: "center"
                                        },
                                        {
                                            type: "text",
                                            contents: [
                                                {
                                                    type: "span",
                                                    text: "物件のエリアを選択してください。（右からもお選びいただけます）\n",
                                                    size: "md"
                                                }
                                            ],
                                            wrap: true,
                                            margin: "lg"
                                        },
                                        {
                                            type: "text",
                                            text: "hello, world",
                                            contents: [
                                                {
                                                    type: "span",
                                                    text: "※城北エリア：文京区、豊島区、板橋区、北区、荒川区、足立区\n",
                                                    size: "md"
                                                },
                                                {
                                                    type: "span",
                                                    text: "城南エリア：港区、品川区、目黒区、大田区\n",
                                                    size: "md"
                                                },
                                                {
                                                    type: "span",
                                                    text: "城西エリア：渋谷区、新宿区、世田谷区、中野区、杉並区、練馬区\n",
                                                    size: "md"
                                                },
                                                {
                                                    type: "span",
                                                    text: "城東エリア：中央区、江東区、台東区、墨田区、葛飾区、江戸川区\n",
                                                    size: "md"
                                                }
                                            ],
                                            wrap: true,
                                            margin: "none"
                                        },
                                        {
                                            type: "box",
                                            layout: "vertical",
                                            spacing: "none",
                                            contents: [
                                                {
                                                    type: "box",
                                                    layout: "vertical",
                                                    contents: [
                                                        {
                                                            type: "text",
                                                            text: "東京",
                                                            size: "xs",
                                                            weight: "bold",
                                                            decoration: "none",
                                                            offsetStart: "lg"
                                                        },
                                                        {
                                                            type: "separator"
                                                        }
                                                    ]
                                                },
                                                {
                                                    type: "button",
                                                    style: "primary",
                                                    action: {
                                                        type: "message",
                                                        text: "東京都（城北エリア）",
                                                        label: "東京都（城北エリア）"
                                                    },
                                                    color: "#F09199",
                                                    margin: "md",
                                                    height: "sm"
                                                },
                                                {
                                                    type: "button",
                                                    style: "primary",
                                                    height: "sm",
                                                    action: {
                                                        type: "message",
                                                        label: "東京都（城南エリア）",
                                                        text: "東京都（城南エリア）"
                                                    },
                                                    color: "#F09199",
                                                    margin: "xl"
                                                },
                                                {
                                                    type: "button",
                                                    style: "primary",
                                                    height: "sm",
                                                    action: {
                                                        type: "message",
                                                        label: "東京都（城西エリア）",
                                                        text: "東京都（城西エリア）"
                                                    },
                                                    color: "#F09199",
                                                    margin: "xl"
                                                },
                                                {
                                                    type: "button",
                                                    style: "primary",
                                                    height: "sm",
                                                    action: {
                                                        type: "message",
                                                        label: "東京都（城東エリア）",
                                                        text: "東京都（城東エリア）"
                                                    },
                                                    color: "#F09199",
                                                    margin: "xl"
                                                },
                                                {
                                                    type: "button",
                                                    style: "primary",
                                                    height: "sm",
                                                    action: {
                                                        type: "message",
                                                        label: "東京都（23区外）",
                                                        text: "東京都（23区外）"
                                                    },
                                                    color: "#F09199",
                                                    margin: "xl"
                                                }
                                            ],
                                            borderWidth: "none",
                                            margin: "none"
                                        }
                                    ]
                                }
                            },
                            {
                                type: "bubble",
                                footer: {
                                    type: "box",
                                    layout: "vertical",
                                    spacing: "sm",
                                    contents: [
                                        {
                                            type: "box",
                                            layout: "vertical",
                                            contents: [
                                                {
                                                    type: "text",
                                                    text: "埼玉",
                                                    size: "xs",
                                                    weight: "bold",
                                                    decoration: "none",
                                                    offsetStart: "lg"
                                                },
                                                {
                                                    type: "separator"
                                                }
                                            ],
                                            margin: "sm"
                                        },
                                        {
                                            type: "button",
                                            style: "primary",
                                            height: "sm",
                                            action: {
                                                type: "message",
                                                label: "埼玉県（さいたま市）",
                                                text: "埼玉県（さいたま市）"
                                            },
                                            color: "#F09199",
                                            margin: "md"
                                        },
                                        {
                                            type: "button",
                                            style: "primary",
                                            height: "sm",
                                            action: {
                                                type: "message",
                                                label: "埼玉県（さいたま市以外）",
                                                text: "埼玉県（さいたま市以外）"
                                            },
                                            color: "#F09199",
                                            margin: "xl"
                                        },
                                        {
                                            type: "box",
                                            layout: "vertical",
                                            contents: [
                                                {
                                                    type: "text",
                                                    text: "神奈川",
                                                    size: "xs",
                                                    weight: "bold",
                                                    decoration: "none",
                                                    offsetStart: "lg"
                                                },
                                                {
                                                    type: "separator"
                                                }
                                            ],
                                            margin: "lg"
                                        },
                                        {
                                            type: "button",
                                            style: "primary",
                                            height: "sm",
                                            action: {
                                                type: "message",
                                                label: "神奈川県（横浜市）",
                                                text: "神奈川県（横浜市）"
                                            },
                                            color: "#F09199",
                                            margin: "md"
                                        },
                                        {
                                            type: "button",
                                            style: "primary",
                                            height: "sm",
                                            action: {
                                                type: "message",
                                                label: "神奈川県（横浜市以外）",
                                                text: "神奈川県（横浜市以外）"
                                            },
                                            color: "#F09199",
                                            margin: "xl"
                                        },
                                        {
                                            type: "box",
                                            layout: "vertical",
                                            contents: [
                                                {
                                                    type: "text",
                                                    text: "千葉",
                                                    size: "xs",
                                                    weight: "bold",
                                                    decoration: "none",
                                                    offsetStart: "lg"
                                                },
                                                {
                                                    type: "separator"
                                                }
                                            ],
                                            margin: "md"
                                        },
                                        {
                                            type: "button",
                                            style: "primary",
                                            height: "sm",
                                            action: {
                                                type: "message",
                                                label: "千葉県（千葉市、船橋市）",
                                                text: "千葉県（千葉市、船橋市）"
                                            },
                                            color: "#F09199",
                                            margin: "md"
                                        },
                                        {
                                            type: "button",
                                            style: "primary",
                                            height: "sm",
                                            action: {
                                                type: "message",
                                                label: "千葉県（千葉市、船橋市以外）",
                                                text: "千葉県（千葉市、船橋市以外）"
                                            },
                                            color: "#F09199",
                                            margin: "xl"
                                        }
                                    ],
                                    borderWidth: "none"
                                }
                            }
                        ]
                    },
                    options: [
                        {
                            id: 1,
                            text: "東京都（城北エリア）"
                        },
                        {
                            id: 2,
                            text: "東京都（城南エリア）"
                        },
                        {
                            id: 3,
                            text: "東京都（城西エリア）"
                        },
                        {
                            id: 4,
                            text: "東京都（城東エリア）"
                        },
                        {
                            id: 5,
                            text: "東京都（23区外）"
                        },
                        {
                            id: 6,
                            text: "埼玉県（さいたま市）"
                        },
                        {
                            id: 7,
                            text: "埼玉県（さいたま市以外）"
                        },
                        {
                            id: 8,
                            text: "神奈川県（横浜市）"
                        },
                        {
                            id: 9,
                            text: "神奈川県（横浜市以外）"
                        },
                        {
                            id: 10,
                            text: "千葉県（千葉市、船橋市）"
                        },
                        {
                            id: 11,
                            text: "千葉県（千葉市、船橋市以外）"
                        }
                    ],
                    next: {
                        1: "structure",
                        2: "structure",
                        3: "structure",
                        4: "structure",
                        5: "structure",
                        6: "structure",
                        7: "structure",
                        8: "structure",
                        9: "structure",
                        10: "structure",
                        11: "structure"
                    }
                },
                {
                    id: "structure",
                    type: "multiple-choice",
                    choices_allowed: 2,
                    options: [
                        {
                            id: 1,
                            text: "木造"
                        },
                        {
                            id: 2,
                            text: "軽量鉄骨造"
                        },
                        {
                            id: 3,
                            text: "重量鉄骨造"
                        },
                        {
                            id: 4,
                            text: "RC造"
                        }
                    ],
                    next: "yield"
                },
                {
                    id: "yield",
                    type: "single-choice",
                    design: {
                        type: "carousel",
                        contents: [
                            {
                                type: "bubble",
                                body: {
                                    type: "box",
                                    layout: "vertical",
                                    contents: [
                                        {
                                            type: "text",
                                            text: "希望条件の登録",
                                            weight: "bold",
                                            size: "lg",
                                            align: "center"
                                        },
                                        {
                                            type: "text",
                                            contents: [
                                                {
                                                    type: "span",
                                                    text: "物件の想定利回りを選択してください。",
                                                    size: "md"
                                                }
                                            ],
                                            wrap: true,
                                            margin: "lg"
                                        }
                                    ]
                                },
                                footer: {
                                    type: "box",
                                    layout: "vertical",
                                    spacing: "sm",
                                    contents: [
                                        {
                                            type: "button",
                                            style: "primary",
                                            action: {
                                                type: "message",
                                                text: "4％～（RC造 築浅中心）",
                                                label: "4％～（RC造 築浅中心）"
                                            },
                                            color: "#F09199",
                                            margin: "none",
                                            height: "sm"
                                        },
                                        {
                                            type: "button",
                                            style: "primary",
                                            height: "sm",
                                            action: {
                                                type: "message",
                                                label: "5％～（RC/重量鉄骨造 築浅中心）",
                                                text: "5％～（RC/重量鉄骨造 築浅中心）"
                                            },
                                            color: "#F09199",
                                            margin: "xl"
                                        },
                                        {
                                            type: "button",
                                            style: "primary",
                                            height: "sm",
                                            action: {
                                                type: "message",
                                                label: "6％～（重量/軽量鉄骨造 中心）",
                                                text: "6％～（重量/軽量鉄骨造 中心）"
                                            },
                                            color: "#F09199",
                                            margin: "xl"
                                        },
                                        {
                                            type: "button",
                                            style: "primary",
                                            height: "sm",
                                            action: {
                                                type: "message",
                                                label: "7％～（軽量鉄骨造/木造 中心）",
                                                text: "7％～（軽量鉄骨造/木造 中心）"
                                            },
                                            color: "#F09199",
                                            margin: "xl"
                                        },
                                        {
                                            type: "button",
                                            style: "primary",
                                            height: "sm",
                                            action: {
                                                type: "message",
                                                label: "8％～（木造/耐用年数越え）",
                                                text: "8％～（木造/耐用年数越え）"
                                            },
                                            color: "#F09199",
                                            margin: "xl"
                                        }
                                    ],
                                    borderWidth: "none"
                                }
                            }
                        ]
                    },
                    options: [
                        {
                            id: 1,
                            text: "4％～（RC造 築浅中心）"
                        },
                        {
                            id: 2,
                            text: "5％～（RC/重量鉄骨造 築浅中心）"
                        },
                        {
                            id: 3,
                            text: "6％～（重量/軽量鉄骨造 中心）"
                        },
                        {
                            id: 4,
                            text: "7％～（軽量鉄骨造/木造 中心）"
                        },
                        {
                            id: 5,
                            text: "8％～（木造/耐用年数越え）"
                        }
                    ],
                    next: {
                        1: "end",
                        2: "end",
                        3: "end",
                        4: "end",
                        5: "end"
                    }
                }
            ]
        }
    ]
}