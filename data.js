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

// ========================================
// チェック項目に対応するケアプラン文言テンプレート
// ========================================
const ITEM_TEMPLATES = {
    // 健康状態
    "持病の管理が必要": {
        needs: "持病があるが、安定した健康状態を維持したい",
        longTermGoal: "定期的な通院と服薬管理により健康を維持できる",
        shortTermGoal: "毎日の服薬を忘れずにできる",
        serviceContent: "服薬確認、健康観察、受診同行"
    },
    "体調の変動がある": {
        needs: "体調に変動があるが、安定した状態で過ごしたい",
        longTermGoal: "体調の変化に早期対応し安定した生活を送れる",
        shortTermGoal: "体調の変化を周囲に伝えることができる",
        serviceContent: "バイタルチェック、体調観察、医療連携"
    },
    "痛みの訴えがある": {
        needs: "痛みがあるが、痛みを軽減して快適に過ごしたい",
        longTermGoal: "痛みがコントロールされ日常生活を送れる",
        shortTermGoal: "痛みを適切に訴えることができる",
        serviceContent: "疼痛管理、医師との連携、姿勢の工夫"
    },
    "発熱しやすい": {
        needs: "発熱しやすいが、体調を安定させたい",
        longTermGoal: "感染予防に努め発熱を防ぐことができる",
        shortTermGoal: "手洗い・うがいを習慣化できる",
        serviceContent: "感染予防、体温管理、環境調整"
    },
    "血圧管理が必要": {
        needs: "血圧が不安定だが、適正な血圧を維持したい",
        longTermGoal: "血圧が安定し安心して生活できる",
        shortTermGoal: "毎日血圧を測定できる",
        serviceContent: "血圧測定、服薬管理、生活指導"
    },
    "糖尿病の管理が必要": {
        needs: "糖尿病があるが、血糖値を安定させたい",
        longTermGoal: "血糖コントロールができ合併症を予防できる",
        shortTermGoal: "食事療法を継続できる",
        serviceContent: "血糖測定、食事管理、インスリン管理"
    },
    "心疾患がある": {
        needs: "心疾患があるが、心臓に負担をかけずに生活したい",
        longTermGoal: "心臓の状態が安定し安全に生活できる",
        shortTermGoal: "無理のない活動量を守れる",
        serviceContent: "心機能観察、活動量調整、緊急対応"
    },
    "呼吸器疾患がある": {
        needs: "呼吸が苦しいことがあるが、楽に呼吸したい",
        longTermGoal: "呼吸状態が安定し日常生活を送れる",
        shortTermGoal: "呼吸法を習得できる",
        serviceContent: "呼吸状態観察、酸素管理、環境調整"
    },

    // ADL
    "寝返りが困難": {
        needs: "寝返りが困難だが、床ずれを防ぎたい",
        longTermGoal: "褥瘡を予防し快適に過ごせる",
        shortTermGoal: "定期的な体位変換ができる",
        serviceContent: "体位変換、褥瘡予防、福祉用具"
    },
    "起き上がりが困難": {
        needs: "起き上がりが困難だが、自分で起き上がりたい",
        longTermGoal: "介助があれば起き上がることができる",
        shortTermGoal: "ベッド柵を使って起き上がれる",
        serviceContent: "起き上がり訓練、福祉用具導入"
    },
    "立ち上がりが困難": {
        needs: "立ち上がりが困難だが、自力で立ちたい",
        longTermGoal: "安全に立ち上がることができる",
        shortTermGoal: "手すりを使って立ち上がれる",
        serviceContent: "立ち上がり訓練、手すり設置"
    },
    "歩行が不安定": {
        needs: "歩行が不安定だが、転倒せずに歩きたい",
        longTermGoal: "安全に歩行して外出できる",
        shortTermGoal: "杖を使って安全に歩ける",
        serviceContent: "歩行訓練、見守り、福祉用具"
    },
    "移乗に介助が必要": {
        needs: "移乗に介助が必要だが、安全に移動したい",
        longTermGoal: "安全に車いすへ移乗できる",
        shortTermGoal: "介助者と協力して移乗できる",
        serviceContent: "移乗介助、移乗訓練"
    },
    "車いすを使用": {
        needs: "車いすを使用しているが、自分で操作したい",
        longTermGoal: "車いすで自由に移動できる",
        shortTermGoal: "室内を車いすで移動できる",
        serviceContent: "車いす操作訓練、環境整備"
    },
    "杖・歩行器を使用": {
        needs: "杖・歩行器を使用しているが、安全に歩きたい",
        longTermGoal: "補助具を使って安全に歩行できる",
        shortTermGoal: "杖・歩行器を正しく使える",
        serviceContent: "歩行訓練、福祉用具調整"
    },
    "転倒リスクがある": {
        needs: "転倒しやすいが、転ばずに生活したい",
        longTermGoal: "転倒を予防し安全に生活できる",
        shortTermGoal: "危険な場所を避けられる",
        serviceContent: "転倒予防訓練、環境整備、見守り"
    },

    // IADL
    "買い物が困難": {
        needs: "買い物が困難だが、必要なものを入手したい",
        longTermGoal: "必要な買い物ができ生活を維持できる",
        shortTermGoal: "買い物リストを作成できる",
        serviceContent: "買い物支援、同行援助"
    },
    "調理が困難": {
        needs: "調理が困難だが、栄養のある食事をとりたい",
        longTermGoal: "バランスの良い食事ができる",
        shortTermGoal: "簡単な調理ができる",
        serviceContent: "調理支援、配食サービス"
    },
    "掃除が困難": {
        needs: "掃除が困難だが、清潔な環境で暮らしたい",
        longTermGoal: "清潔な住環境を維持できる",
        shortTermGoal: "身の回りの整理ができる",
        serviceContent: "掃除支援、生活援助"
    },
    "洗濯が困難": {
        needs: "洗濯が困難だが、清潔な衣類を着たい",
        longTermGoal: "清潔な衣類で過ごせる",
        shortTermGoal: "洗濯物をたためる",
        serviceContent: "洗濯支援、生活援助"
    },
    "金銭管理が困難": {
        needs: "金銭管理が困難だが、お金を適切に使いたい",
        longTermGoal: "日常的な金銭管理ができる",
        shortTermGoal: "日常の買い物の金額を理解できる",
        serviceContent: "金銭管理支援、成年後見制度利用検討"
    },
    "服薬管理が困難": {
        needs: "服薬管理が困難だが、薬を正しく飲みたい",
        longTermGoal: "処方された薬を正しく服用できる",
        shortTermGoal: "お薬カレンダーを使える",
        serviceContent: "服薬管理、お薬カレンダー導入"
    },
    "電話の使用が困難": {
        needs: "電話が困難だが、必要な連絡をしたい",
        longTermGoal: "必要な時に連絡を取れる",
        shortTermGoal: "緊急連絡先に電話できる",
        serviceContent: "電話使用訓練、緊急通報装置"
    },
    "交通機関の利用が困難": {
        needs: "交通機関の利用が困難だが、外出したい",
        longTermGoal: "必要な場所に行くことができる",
        shortTermGoal: "付き添いがあれば外出できる",
        serviceContent: "外出支援、移送サービス"
    },

    // 認知機能
    "物忘れがある": {
        needs: "物忘れがあるが、安心して生活したい",
        longTermGoal: "見守りの中で安全に生活できる",
        shortTermGoal: "メモを活用できる",
        serviceContent: "認知症ケア、見守り、生活支援"
    },
    "見当識障害がある": {
        needs: "時間や場所がわからなくなるが、混乱せずに過ごしたい",
        longTermGoal: "穏やかに日常生活を送れる",
        shortTermGoal: "カレンダーで日付を確認できる",
        serviceContent: "見当識訓練、環境調整、声かけ"
    },
    "判断力の低下がある": {
        needs: "判断力が低下しているが、適切な判断をしたい",
        longTermGoal: "支援を受けながら生活できる",
        shortTermGoal: "日常の簡単な判断ができる",
        serviceContent: "意思決定支援、見守り"
    },
    "徘徊がある": {
        needs: "徘徊があるが、安全に過ごしたい",
        longTermGoal: "安全な環境で穏やかに生活できる",
        shortTermGoal: "見守りの中で安全に過ごせる",
        serviceContent: "見守り、GPS活用、環境整備"
    },
    "妄想・幻覚がある": {
        needs: "妄想・幻覚があるが、穏やかに過ごしたい",
        longTermGoal: "不安なく安心して生活できる",
        shortTermGoal: "落ち着いて過ごせる時間が増える",
        serviceContent: "傾聴、環境調整、医療連携"
    },
    "昼夜逆転がある": {
        needs: "昼夜逆転があるが、規則正しく生活したい",
        longTermGoal: "規則正しい生活リズムを維持できる",
        shortTermGoal: "日中の活動時間が増える",
        serviceContent: "生活リズム調整、日中活動支援"
    },
    "暴言・暴力がある": {
        needs: "暴言・暴力があるが、穏やかに過ごしたい",
        longTermGoal: "穏やかな気持ちで生活できる",
        shortTermGoal: "イライラの原因が軽減される",
        serviceContent: "環境調整、原因除去、専門的ケア"
    },
    "介護への抵抗がある": {
        needs: "介護への抵抗があるが、必要なケアを受けたい",
        longTermGoal: "信頼関係の中でケアを受け入れられる",
        shortTermGoal: "特定の介護者からケアを受けられる",
        serviceContent: "関係構築、声かけの工夫、ペース配慮"
    },

    // コミュニケーション
    "聴力の低下がある": {
        needs: "聴力が低下しているが、会話を楽しみたい",
        longTermGoal: "コミュニケーションを維持できる",
        shortTermGoal: "補聴器を使用できる",
        serviceContent: "補聴器調整、筆談、ゆっくり話す"
    },
    "視力の低下がある": {
        needs: "視力が低下しているが、安全に生活したい",
        longTermGoal: "視覚補助を使って安全に生活できる",
        shortTermGoal: "眼鏡・拡大鏡を使用できる",
        serviceContent: "視覚補助、環境整備、読み上げ支援"
    },
    "言語障害がある": {
        needs: "言語障害があるが、意思を伝えたい",
        longTermGoal: "自分の意思を伝えられる",
        shortTermGoal: "ジェスチャーで意思を伝えられる",
        serviceContent: "言語訓練、コミュニケーション支援"
    },
    "意思疎通が困難": {
        needs: "意思疎通が困難だが、気持ちを理解してほしい",
        longTermGoal: "コミュニケーション手段が確立できる",
        shortTermGoal: "表情や仕草で意思を伝えられる",
        serviceContent: "非言語コミュニケーション支援"
    },
    "発語が少ない": {
        needs: "発語が少ないが、もっと話したい",
        longTermGoal: "自発的な発語が増える",
        shortTermGoal: "声かけに反応できる",
        serviceContent: "傾聴、会話促進、言語訓練"
    },
    "理解力の低下がある": {
        needs: "理解力が低下しているが、説明を理解したい",
        longTermGoal: "簡単な説明を理解できる",
        shortTermGoal: "短い文で理解できる",
        serviceContent: "わかりやすい説明、繰り返し説明"
    },

    // 社会との交流
    "外出機会が少ない": {
        needs: "外出機会が少ないが、外に出たい",
        longTermGoal: "定期的に外出できる",
        shortTermGoal: "週1回は外出できる",
        serviceContent: "外出支援、通所サービス"
    },
    "閉じこもりがち": {
        needs: "閉じこもりがちだが、人と交流したい",
        longTermGoal: "社会参加の機会が持てる",
        shortTermGoal: "デイサービスに参加できる",
        serviceContent: "通所サービス、社会参加支援"
    },
    "社会参加の意欲低下": {
        needs: "社会参加の意欲が低下しているが、楽しみを見つけたい",
        longTermGoal: "楽しみながら社会参加できる",
        shortTermGoal: "興味のある活動に参加できる",
        serviceContent: "活動参加支援、趣味活動支援"
    },
    "趣味・活動がない": {
        needs: "趣味・活動がないが、楽しみを見つけたい",
        longTermGoal: "趣味を持ち充実した日々を送れる",
        shortTermGoal: "興味のある活動を見つけられる",
        serviceContent: "レクリエーション、趣味活動紹介"
    },
    "友人・知人との交流減少": {
        needs: "友人との交流が減っているが、つながりを持ちたい",
        longTermGoal: "人とのつながりを維持できる",
        shortTermGoal: "定期的に人と会える",
        serviceContent: "交流機会の提供、訪問支援"
    },
    "孤立傾向がある": {
        needs: "孤立しがちだが、誰かとつながりたい",
        longTermGoal: "地域社会とのつながりが持てる",
        shortTermGoal: "定期的な訪問を受け入れられる",
        serviceContent: "見守り訪問、通所サービス"
    },

    // 排泄
    "尿失禁がある": {
        needs: "尿失禁があるが、清潔に過ごしたい",
        longTermGoal: "適切な排泄管理ができる",
        shortTermGoal: "時間を決めてトイレに行ける",
        serviceContent: "排泄誘導、パッド使用、陰部清拭"
    },
    "便失禁がある": {
        needs: "便失禁があるが、清潔に過ごしたい",
        longTermGoal: "排便コントロールができる",
        shortTermGoal: "便意を伝えられる",
        serviceContent: "排便管理、おむつ交換、清拭"
    },
    "トイレまでの移動が困難": {
        needs: "トイレまでの移動が困難だが、トイレで排泄したい",
        longTermGoal: "トイレで排泄できる",
        shortTermGoal: "介助があればトイレに行ける",
        serviceContent: "トイレ誘導、移動介助、手すり設置"
    },
    "夜間の排泄介助が必要": {
        needs: "夜間の排泄介助が必要だが、安眠したい",
        longTermGoal: "安心して夜間も過ごせる",
        shortTermGoal: "夜間1回のトイレで済む",
        serviceContent: "夜間排泄介助、ポータブルトイレ"
    },
    "おむつを使用": {
        needs: "おむつを使用しているが、快適に過ごしたい",
        longTermGoal: "皮膚トラブルなく過ごせる",
        shortTermGoal: "適切なおむつ交換ができる",
        serviceContent: "おむつ交換、皮膚観察、清潔保持"
    },
    "ポータブルトイレを使用": {
        needs: "ポータブルトイレを使用しているが、自分で使いたい",
        longTermGoal: "ポータブルトイレを自立して使える",
        shortTermGoal: "介助があれば使える",
        serviceContent: "排泄介助、ポータブルトイレ管理"
    },
    "排泄の訴えができない": {
        needs: "排泄の訴えができないが、清潔に過ごしたい",
        longTermGoal: "定時誘導で排泄管理ができる",
        shortTermGoal: "排泄サインを介護者が把握できる",
        serviceContent: "定時排泄誘導、サイン観察"
    },
    "便秘傾向がある": {
        needs: "便秘傾向があるが、スムーズに排便したい",
        longTermGoal: "規則正しい排便習慣ができる",
        shortTermGoal: "水分・食物繊維を摂取できる",
        serviceContent: "排便管理、水分補給、運動促進"
    },

    // 栄養
    "食欲不振がある": {
        needs: "食欲がないが、しっかり食べたい",
        longTermGoal: "食欲が回復し必要な栄養を摂れる",
        shortTermGoal: "少量でも食事ができる",
        serviceContent: "食事観察、嗜好調査、栄養管理"
    },
    "体重減少がある": {
        needs: "体重が減っているが、体重を維持したい",
        longTermGoal: "適正体重を維持できる",
        shortTermGoal: "必要なカロリーを摂取できる",
        serviceContent: "栄養管理、体重測定、食事調整"
    },
    "嚥下困難がある": {
        needs: "嚥下が困難だが、安全に食事をしたい",
        longTermGoal: "誤嚥なく食事ができる",
        shortTermGoal: "食事形態を工夫して食べられる",
        serviceContent: "嚥下訓練、食事形態調整、見守り"
    },
    "食事摂取量が少ない": {
        needs: "食事量が少ないが、しっかり食べたい",
        longTermGoal: "必要な食事量を摂取できる",
        shortTermGoal: "配膳された食事の半分を食べられる",
        serviceContent: "食事介助、嗜好調査、少量多回食"
    },
    "偏食がある": {
        needs: "偏食があるが、バランスよく食べたい",
        longTermGoal: "バランスの良い食事ができる",
        shortTermGoal: "苦手な食材を少し食べられる",
        serviceContent: "栄養指導、調理の工夫"
    },
    "水分摂取が不十分": {
        needs: "水分摂取が不十分だが、脱水を防ぎたい",
        longTermGoal: "必要な水分を摂取できる",
        shortTermGoal: "1日1000ml以上水分を摂れる",
        serviceContent: "水分補給促進、こまめな声かけ"
    },
    "食事形態の工夫が必要": {
        needs: "食事形態の工夫が必要だが、食事を楽しみたい",
        longTermGoal: "安全においしく食事ができる",
        shortTermGoal: "適切な食事形態で食べられる",
        serviceContent: "食事形態調整、調理の工夫"
    },
    "経管栄養を使用": {
        needs: "経管栄養を使用しているが、安全に栄養を摂りたい",
        longTermGoal: "合併症なく栄養を摂取できる",
        shortTermGoal: "経管栄養の管理ができる",
        serviceContent: "経管栄養管理、口腔ケア、医療連携"
    },

    // 口腔
    "口腔内の清潔保持が困難": {
        needs: "口腔ケアが困難だが、口の中を清潔にしたい",
        longTermGoal: "口腔内を清潔に保てる",
        shortTermGoal: "毎食後に歯磨きができる",
        serviceContent: "口腔ケア支援、歯磨き介助"
    },
    "義歯の不具合がある": {
        needs: "義歯が合わないが、しっかり噛みたい",
        longTermGoal: "義歯で食事ができる",
        shortTermGoal: "義歯の調整ができる",
        serviceContent: "義歯管理、歯科受診支援"
    },
    "歯・歯肉に問題がある": {
        needs: "歯や歯肉に問題があるが、食事を楽しみたい",
        longTermGoal: "口腔状態が改善できる",
        shortTermGoal: "歯科受診ができる",
        serviceContent: "口腔ケア、歯科受診支援"
    },
    "口臭がある": {
        needs: "口臭があるが、口の中を快適にしたい",
        longTermGoal: "口臭が改善できる",
        shortTermGoal: "口腔ケアを習慣化できる",
        serviceContent: "口腔ケア、舌苔除去、歯科連携"
    },
    "口腔乾燥がある": {
        needs: "口が乾燥するが、口の中を潤したい",
        longTermGoal: "口腔乾燥が改善できる",
        shortTermGoal: "こまめに水分を摂れる",
        serviceContent: "口腔保湿、唾液腺マッサージ"
    },
    "嚥下機能の低下がある": {
        needs: "嚥下機能が低下しているが、安全に飲み込みたい",
        longTermGoal: "誤嚥を予防できる",
        shortTermGoal: "嚥下体操ができる",
        serviceContent: "嚥下訓練、食事形態調整、姿勢調整"
    },

    // 皮膚
    "褥瘡がある": {
        needs: "褥瘡があるが、早く治したい",
        longTermGoal: "褥瘡が治癒できる",
        shortTermGoal: "褥瘡が悪化しない",
        serviceContent: "褥瘡ケア、体位変換、栄養管理"
    },
    "褥瘡リスクが高い": {
        needs: "褥瘡リスクが高いが、褥瘡を防ぎたい",
        longTermGoal: "褥瘡を予防できる",
        shortTermGoal: "定期的な体位変換ができる",
        serviceContent: "体位変換、除圧マット、皮膚観察"
    },
    "皮膚トラブルがある": {
        needs: "皮膚トラブルがあるが、肌を健康にしたい",
        longTermGoal: "皮膚の状態が改善できる",
        shortTermGoal: "皮膚の清潔を保てる",
        serviceContent: "皮膚ケア、清潔保持、軟膏塗布"
    },
    "ストーマを使用": {
        needs: "ストーマを使用しているが、管理を続けたい",
        longTermGoal: "ストーマの自己管理ができる",
        shortTermGoal: "パウチ交換ができる",
        serviceContent: "ストーマケア、皮膚観察、医療連携"
    },
    "カテーテルを使用": {
        needs: "カテーテルを使用しているが、感染を防ぎたい",
        longTermGoal: "感染なく管理できる",
        shortTermGoal: "清潔操作ができる",
        serviceContent: "カテーテル管理、感染予防、医療連携"
    },
    "皮膚の乾燥がある": {
        needs: "皮膚が乾燥しているが、しっとりさせたい",
        longTermGoal: "皮膚の乾燥が改善できる",
        shortTermGoal: "保湿剤を塗れる",
        serviceContent: "保湿ケア、入浴介助、スキンケア"
    },

    // 環境
    "住環境に段差がある": {
        needs: "住環境に段差があるが、安全に移動したい",
        longTermGoal: "安全な住環境で生活できる",
        shortTermGoal: "段差を認識して注意できる",
        serviceContent: "住宅改修、段差解消、手すり設置"
    },
    "手すりが不足": {
        needs: "手すりが不足しているが、安全に移動したい",
        longTermGoal: "手すりを使って安全に移動できる",
        shortTermGoal: "必要な場所に手すりが設置される",
        serviceContent: "住宅改修、手すり設置"
    },
    "トイレ・浴室が使いにくい": {
        needs: "トイレ・浴室が使いにくいが、自分で使いたい",
        longTermGoal: "トイレ・浴室を自分で使える",
        shortTermGoal: "改修後のトイレ・浴室に慣れる",
        serviceContent: "住宅改修、福祉用具導入"
    },
    "室温管理が不十分": {
        needs: "室温管理が不十分だが、快適に過ごしたい",
        longTermGoal: "適切な室温で快適に過ごせる",
        shortTermGoal: "エアコンを使用できる",
        serviceContent: "室温管理支援、見守り"
    },
    "照明が不十分": {
        needs: "照明が不十分だが、転倒せずに歩きたい",
        longTermGoal: "十分な照明で安全に生活できる",
        shortTermGoal: "足元灯を使用できる",
        serviceContent: "環境整備、照明改善"
    },
    "福祉用具の導入が必要": {
        needs: "福祉用具が必要だが、適切なものを使いたい",
        longTermGoal: "適切な福祉用具で生活できる",
        shortTermGoal: "福祉用具の使い方を習得できる",
        serviceContent: "福祉用具選定、使用訓練"
    },

    // 家族の状況
    "主介護者の負担が大きい": {
        needs: "介護者の負担が大きいが、在宅生活を続けたい",
        longTermGoal: "介護者の負担が軽減できる",
        shortTermGoal: "レスパイトを利用できる",
        serviceContent: "レスパイトケア、介護者支援"
    },
    "介護者が高齢": {
        needs: "介護者が高齢だが、無理なく介護を続けたい",
        longTermGoal: "介護者の健康を維持できる",
        shortTermGoal: "介護サービスを適切に利用できる",
        serviceContent: "介護サービス調整、介護者支援"
    },
    "介護者の健康問題": {
        needs: "介護者に健康問題があるが、介護を続けたい",
        longTermGoal: "介護者が健康を維持できる",
        shortTermGoal: "介護者が通院できる",
        serviceContent: "介護者支援、サービス調整"
    },
    "介護者の就労との両立": {
        needs: "介護と仕事の両立が難しいが、続けたい",
        longTermGoal: "介護と仕事を両立できる",
        shortTermGoal: "日中のサービスを利用できる",
        serviceContent: "通所サービス、ショートステイ"
    },
    "家族間の意見相違": {
        needs: "家族間で意見が違うが、協力して介護したい",
        longTermGoal: "家族で協力して介護できる",
        shortTermGoal: "家族会議ができる",
        serviceContent: "家族調整、カンファレンス開催"
    },
    "独居である": {
        needs: "独居だが、安心して暮らしたい",
        longTermGoal: "見守りの中で安全に生活できる",
        shortTermGoal: "定期的な見守りを受けられる",
        serviceContent: "見守りサービス、緊急通報装置"
    },
    "介護力が不足": {
        needs: "介護力が不足しているが、在宅生活を続けたい",
        longTermGoal: "必要な介護サービスを受けられる",
        shortTermGoal: "適切なサービスを利用できる",
        serviceContent: "サービス調整、地域資源活用"
    },
    "経済的な課題がある": {
        needs: "経済的な課題があるが、必要なサービスを受けたい",
        longTermGoal: "経済状況に応じたサービスを受けられる",
        shortTermGoal: "利用可能な制度を把握できる",
        serviceContent: "制度紹介、減額申請支援"
    },

    // 特別な医療
    "点滴・注射が必要": {
        needs: "点滴・注射が必要だが、安全に管理したい",
        longTermGoal: "点滴・注射を安全に継続できる",
        shortTermGoal: "医療処置を受け入れられる",
        serviceContent: "医療処置、訪問看護"
    },
    "酸素療法を実施": {
        needs: "酸素療法を行っているが、安全に管理したい",
        longTermGoal: "酸素療法を継続できる",
        shortTermGoal: "酸素機器を正しく使える",
        serviceContent: "酸素管理、呼吸状態観察"
    },
    "人工呼吸器を使用": {
        needs: "人工呼吸器を使用しているが、安全に生活したい",
        longTermGoal: "人工呼吸器を安全に管理できる",
        shortTermGoal: "家族が機器操作できる",
        serviceContent: "呼吸器管理、緊急対応、医療連携"
    },
    "気管切開がある": {
        needs: "気管切開があるが、安全に管理したい",
        longTermGoal: "気管切開部を清潔に保てる",
        shortTermGoal: "吸引ができる",
        serviceContent: "気管切開ケア、吸引、医療連携"
    },
    "経管栄養を実施": {
        needs: "経管栄養を実施しているが、安全に管理したい",
        longTermGoal: "経管栄養を安全に継続できる",
        shortTermGoal: "注入の手順を守れる",
        serviceContent: "経管栄養管理、口腔ケア"
    },
    "透析を実施": {
        needs: "透析を行っているが、体調を維持したい",
        longTermGoal: "透析を継続しながら生活できる",
        shortTermGoal: "透析のスケジュールを守れる",
        serviceContent: "透析通院支援、体調管理"
    },
    "吸引が必要": {
        needs: "吸引が必要だが、苦しくならないようにしたい",
        longTermGoal: "痰の管理ができる",
        shortTermGoal: "定期的な吸引を受けられる",
        serviceContent: "吸引、呼吸状態観察、姿勢調整"
    },
    "インスリン注射が必要": {
        needs: "インスリン注射が必要だが、正しく続けたい",
        longTermGoal: "インスリン管理を継続できる",
        shortTermGoal: "正しく注射できる",
        serviceContent: "インスリン管理、血糖測定支援"
    },

    // その他
    "上記以外の課題がある": {
        needs: "個別の課題があるが、解決したい",
        longTermGoal: "課題が解決できる",
        shortTermGoal: "課題への対応策が見つかる",
        serviceContent: "個別支援計画の作成"
    },
    "本人の希望がある": {
        needs: "本人の希望を叶えたい",
        longTermGoal: "本人の希望が実現できる",
        shortTermGoal: "希望実現に向けて取り組める",
        serviceContent: "希望に沿ったサービス調整"
    },
    "家族の希望がある": {
        needs: "家族の希望を考慮したい",
        longTermGoal: "家族の希望も踏まえた生活ができる",
        shortTermGoal: "家族と話し合いができる",
        serviceContent: "家族との連携、サービス調整"
    },
    "専門職の意見がある": {
        needs: "専門職の意見を反映したい",
        longTermGoal: "専門職の意見を踏まえたケアができる",
        shortTermGoal: "専門職と連携できる",
        serviceContent: "多職種連携、専門的支援"
    }
};
