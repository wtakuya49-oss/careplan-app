// ========================================
// 厚生労働省 課題分析標準項目（23項目）
// ========================================

// サービス種別
const SERVICE_TYPES = {
    facility: {
        id: 'facility',
        name: '施設サービス',
        planName: '施設サービス計画書（第2表）'
    },
    home: {
        id: 'home',
        name: '居宅サービス',
        planName: '居宅サービス計画書（第2表）'
    }
};

// 基本情報（9項目）
const BASIC_INFO_ITEMS = [
    {
        id: 'basic_info',
        name: '受付・利用者等基本情報',
        fields: [
            { id: 'reception_date', label: '受付日', type: 'date' },
            { id: 'name', label: '氏名', type: 'text' },
            { id: 'gender', label: '性別', type: 'select', options: ['男性', '女性'] },
            { id: 'birth_date', label: '生年月日', type: 'date' },
            { id: 'address', label: '住所', type: 'text' },
            { id: 'phone', label: '電話番号', type: 'tel' }
        ]
    },
    {
        id: 'insurance_info',
        name: '利用者の被保険者情報',
        fields: [
            { id: 'insurance_number', label: '被保険者番号', type: 'text' },
            { id: 'care_level', label: '要介護度', type: 'select', options: ['要支援1', '要支援2', '要介護1', '要介護2', '要介護3', '要介護4', '要介護5'] }
        ]
    },
    {
        id: 'current_services',
        name: '現在利用しているサービスの状況',
        fields: [
            { id: 'current_services_text', label: '利用中のサービス', type: 'textarea' }
        ]
    },
    {
        id: 'adl_level',
        name: '障害高齢者の日常生活自立度',
        fields: [
            { id: 'adl_rank', label: '自立度', type: 'select', options: ['自立', 'J1', 'J2', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'] }
        ]
    },
    {
        id: 'dementia_level',
        name: '認知症高齢者の日常生活自立度',
        fields: [
            { id: 'dementia_rank', label: '自立度', type: 'select', options: ['自立', 'I', 'IIa', 'IIb', 'IIIa', 'IIIb', 'IV', 'M'] }
        ]
    },
    {
        id: 'user_status',
        name: '利用者の状況',
        fields: [
            { id: 'status_text', label: '利用者の状況', type: 'textarea' }
        ]
    },
    {
        id: 'chief_complaint',
        name: '主訴',
        fields: [
            { id: 'complaint_text', label: '主訴・要望', type: 'textarea' }
        ]
    },
    {
        id: 'living_condition',
        name: '生活状況',
        fields: [
            { id: 'living_text', label: '生活状況', type: 'textarea' }
        ]
    },
    {
        id: 'medical_info',
        name: '医療情報',
        fields: [
            { id: 'diagnosis', label: '診断名', type: 'text' },
            { id: 'hospital', label: '主治医・医療機関', type: 'text' },
            { id: 'medication', label: '服薬状況', type: 'textarea' }
        ]
    }
];

// 課題分析項目（14項目）
const ASSESSMENT_CATEGORIES = [
    {
        id: 'health_status',
        name: '健康状態',
        icon: '🏥',
        checkItems: [
            '持病の管理が必要',
            '体調の変動がある',
            '痛みの訴えがある',
            '発熱しやすい',
            '血圧管理が必要',
            '糖尿病の管理が必要',
            '心疾患がある',
            '呼吸器疾患がある'
        ]
    },
    {
        id: 'adl',
        name: 'ADL（日常生活動作）',
        icon: '🚶',
        checkItems: [
            '寝返りが困難',
            '起き上がりが困難',
            '立ち上がりが困難',
            '歩行が不安定',
            '移乗に介助が必要',
            '車いすを使用',
            '杖・歩行器を使用',
            '転倒リスクがある'
        ]
    },
    {
        id: 'iadl',
        name: 'IADL（手段的日常生活動作）',
        icon: '🏠',
        checkItems: [
            '買い物が困難',
            '調理が困難',
            '掃除が困難',
            '洗濯が困難',
            '金銭管理が困難',
            '服薬管理が困難',
            '電話の使用が困難',
            '交通機関の利用が困難'
        ]
    },
    {
        id: 'cognition',
        name: '認知機能',
        icon: '🧠',
        checkItems: [
            '物忘れがある',
            '見当識障害がある',
            '判断力の低下がある',
            '徘徊がある',
            '妄想・幻覚がある',
            '昼夜逆転がある',
            '暴言・暴力がある',
            '介護への抵抗がある'
        ]
    },
    {
        id: 'communication',
        name: 'コミュニケーション能力',
        icon: '💬',
        checkItems: [
            '聴力の低下がある',
            '視力の低下がある',
            '言語障害がある',
            '意思疎通が困難',
            '発語が少ない',
            '理解力の低下がある'
        ]
    },
    {
        id: 'social_interaction',
        name: '社会との交流',
        icon: '👥',
        checkItems: [
            '外出機会が少ない',
            '閉じこもりがち',
            '社会参加の意欲低下',
            '趣味・活動がない',
            '友人・知人との交流減少',
            '孤立傾向がある'
        ]
    },
    {
        id: 'excretion',
        name: '排泄',
        icon: '🚽',
        checkItems: [
            '尿失禁がある',
            '便失禁がある',
            'トイレまでの移動が困難',
            '夜間の排泄介助が必要',
            'おむつを使用',
            'ポータブルトイレを使用',
            '排泄の訴えができない',
            '便秘傾向がある'
        ]
    },
    {
        id: 'nutrition',
        name: '栄養',
        icon: '🍽️',
        checkItems: [
            '食欲不振がある',
            '体重減少がある',
            '嚥下困難がある',
            '食事摂取量が少ない',
            '偏食がある',
            '水分摂取が不十分',
            '食事形態の工夫が必要',
            '経管栄養を使用'
        ]
    },
    {
        id: 'oral',
        name: '口腔',
        icon: '🦷',
        checkItems: [
            '口腔内の清潔保持が困難',
            '義歯の不具合がある',
            '歯・歯肉に問題がある',
            '口臭がある',
            '口腔乾燥がある',
            '嚥下機能の低下がある'
        ]
    },
    {
        id: 'skin',
        name: '皮膚・排泄管理',
        icon: '🩹',
        checkItems: [
            '褥瘡がある',
            '褥瘡リスクが高い',
            '皮膚トラブルがある',
            'ストーマを使用',
            'カテーテルを使用',
            '皮膚の乾燥がある'
        ]
    },
    {
        id: 'environment',
        name: '環境',
        icon: '🏡',
        checkItems: [
            '住環境に段差がある',
            '手すりが不足',
            'トイレ・浴室が使いにくい',
            '室温管理が不十分',
            '照明が不十分',
            '福祉用具の導入が必要'
        ]
    },
    {
        id: 'family_status',
        name: '家族の状況',
        icon: '👨‍👩‍👧',
        checkItems: [
            '主介護者の負担が大きい',
            '介護者が高齢',
            '介護者の健康問題',
            '介護者の就労との両立',
            '家族間の意見相違',
            '独居である',
            '介護力が不足',
            '経済的な課題がある'
        ]
    },
    {
        id: 'special_medical',
        name: '特別な医療',
        icon: '💉',
        checkItems: [
            '点滴・注射が必要',
            '酸素療法を実施',
            '人工呼吸器を使用',
            '気管切開がある',
            '経管栄養を実施',
            '透析を実施',
            '吸引が必要',
            'インスリン注射が必要'
        ]
    },
    {
        id: 'other',
        name: 'その他',
        icon: '📋',
        checkItems: [
            '上記以外の課題がある',
            '本人の希望がある',
            '家族の希望がある',
            '専門職の意見がある'
        ]
    }
];

// 全カテゴリ（基本情報 + 課題分析）
const ALL_CATEGORIES = {
    basicInfo: BASIC_INFO_ITEMS,
    assessment: ASSESSMENT_CATEGORIES
};
