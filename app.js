// ========================================
// ケアプラン作成支援アプリ - メインアプリケーション
// ========================================

// グローバル状態
let currentScreen = 'homeScreen';
let selectedServiceType = null;
let currentCategoryIndex = 0;
let assessmentData = {};
let basicInfoData = {};
let carePlanItems = [];
let useLocalAI = false;
let aiSession = null;
let apiKey = localStorage.getItem('geminiApiKey') || '';

// 利用者管理
let users = JSON.parse(localStorage.getItem('careplan_users') || '[]');
let currentUserId = null;
let currentPlanId = null; // 現在編集中の計画書ID
let savedCarePlans = JSON.parse(localStorage.getItem('careplan_plans') || '[]');

// ========================================
// 初期化
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    await checkLocalAI();
    showScreen('homeScreen');
});

// ========================================
// ローカルAIチェック
// ========================================
async function checkLocalAI() {
    try {
        if ('ai' in window && 'languageModel' in window.ai) {
            const capabilities = await window.ai.languageModel.capabilities();

            if (capabilities.available === 'readily') {
                aiSession = await window.ai.languageModel.create();
                useLocalAI = true;
                updatePrivacyBadge(true);
                updateAIStatusBadge(true);
                console.log('ローカルAI利用可能');
            } else if (capabilities.available === 'after-download') {
                updatePrivacyBadge(false, 'AIモデルをダウンロード中...');
                aiSession = await window.ai.languageModel.create();
                useLocalAI = true;
                updatePrivacyBadge(true);
                updateAIStatusBadge(true);
            } else {
                throw new Error('ローカルAI非対応');
            }
        } else {
            throw new Error('Prompt API未対応');
        }
    } catch (error) {
        console.log('ローカルAI利用不可:', error);
        useLocalAI = false;
        updatePrivacyBadge(false);
        updateAIStatusBadge(false);
        showFallbackNotice();
    }
}

function updateAIStatusBadge(isLocal) {
    const badge = document.getElementById('aiStatusBadge');
    if (!badge) return;

    if (isLocal) {
        badge.innerHTML = `
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 12px 20px; border-radius: 12px; text-align: center;">
                <div style="font-size: 24px; margin-bottom: 4px;">✅</div>
                <div style="font-weight: 600;">ローカルAI利用可能</div>
                <div style="font-size: 12px; opacity: 0.9;">完全オフラインで動作します</div>
            </div>
        `;
    } else {
        badge.innerHTML = `
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 12px 20px; border-radius: 12px; text-align: center;">
                <div style="font-size: 24px; margin-bottom: 4px;">⚠️</div>
                <div style="font-weight: 600;">ローカルAI利用不可</div>
                <div style="font-size: 12px; opacity: 0.9;">${apiKey ? 'APIキー設定済み' : '手動入力または設定からAPIキーを入力'}</div>
            </div>
        `;
    }
}

function showFallbackNotice() {
    const notice = document.getElementById('fallbackNotice');
    if (notice) {
        notice.classList.remove('hidden');
    }
}

function updatePrivacyBadge(isLocal, customMessage = null) {
    const badge = document.getElementById('privacyBadge');
    if (!badge) return;

    if (customMessage) {
        badge.innerHTML = `⏳ ${customMessage}`;
        badge.className = 'privacy-badge processing';
    } else if (isLocal) {
        badge.innerHTML = '🔒 端末内処理のみ - データは外部送信されません';
        badge.className = 'privacy-badge';
    } else {
        badge.innerHTML = '🔐 データはあなたの端末に保存されます';
        badge.className = 'privacy-badge';
    }
}

// ========================================
// 画面遷移
// ========================================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
        currentScreen = screenId;
    }

    // 画面ごとの初期化
    if (screenId === 'assessmentScreen') {
        renderCategoryTabs();
        renderCategoryContent();
    } else if (screenId === 'carePlanScreen') {
        renderCarePlan();
    }
}

// ========================================
// サービス種別選択
// ========================================
function selectServiceType(type) {
    selectedServiceType = type;

    // UI更新
    document.querySelectorAll('.service-type-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-type="${type}"]`)?.classList.add('selected');

    // 次へボタン有効化
    const nextBtn = document.getElementById('startAssessmentBtn');
    if (nextBtn) nextBtn.disabled = false;
}

function startAssessment() {
    if (!selectedServiceType) {
        alert('サービス種別を選択してください');
        return;
    }
    currentPlanId = null; // 新規作成なのでリセット
    carePlanItems = []; // 計画書アイテムもリセット
    assessmentData = {}; // アセスメントデータもリセット
    showScreen('assessmentScreen');
}

// ========================================
// カテゴリタブ
// ========================================
function renderCategoryTabs() {
    const container = document.getElementById('categoryTabs');
    if (!container) return;

    const html = ASSESSMENT_CATEGORIES.map((cat, index) => {
        const isActive = index === currentCategoryIndex;
        const data = assessmentData[cat.id] || { checkedItems: [] };
        const hasData = data.checkedItems.length > 0;

        return `
            <button class="category-tab ${isActive ? 'active' : ''}" 
                    onclick="switchCategory(${index})">
                <span>${cat.icon}</span>
                <span>${cat.name}</span>
                ${hasData ? `<span class="badge">${data.checkedItems.length}</span>` : ''}
            </button>
        `;
    }).join('');

    container.innerHTML = html;
}

function switchCategory(index) {
    saveCurrentCategoryData();
    currentCategoryIndex = index;
    renderCategoryTabs();
    renderCategoryContent();
}

// ========================================
// カテゴリコンテンツ
// ========================================
function renderCategoryContent() {
    const container = document.getElementById('categoryContent');
    if (!container) return;

    const category = ASSESSMENT_CATEGORIES[currentCategoryIndex];
    const savedData = assessmentData[category.id] || { checkedItems: [], detailText: '' };

    const html = `
        <div class="card">
            <h3 class="card-title">
                <span class="icon">${category.icon}</span>
                ${category.name}
            </h3>
            
            <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 16px;">
                該当する項目にチェックを入れてください
            </p>
            
            <div class="checkbox-list">
                ${category.checkItems.map((item, index) => `
                    <div class="checkbox-item">
                        <input type="checkbox" 
                               id="check-${index}" 
                               ${savedData.checkedItems.includes(item) ? 'checked' : ''}
                               onchange="onCheckChange()">
                        <label for="check-${index}">${item}</label>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="card">
            <h3 class="card-title">具体的内容・対応するケア項目</h3>
            <textarea class="form-textarea" 
                      id="detailText" 
                      placeholder="チェックした項目について、詳細を記入してください"
                      onblur="saveCurrentCategoryData()">${savedData.detailText || ''}</textarea>
        </div>
        
        <div class="card">
            <button class="generate-btn ${useLocalAI ? 'local-ai' : ''}" 
                    onclick="generateFromCategory()" 
                    id="generateCategoryBtn"
                    ${!useLocalAI && !apiKey ? 'disabled' : ''}>
                ${useLocalAI ? '🔒 この項目を生成（端末内処理）' : '✨ この項目を生成'}
            </button>
            
            <button class="generate-btn mt-4" 
                    onclick="generateFromAllCategories()" 
                    id="generateAllBtn"
                    ${!useLocalAI && !apiKey ? 'disabled' : ''}>
                🌟 すべてから統合生成 
                <span id="checkedCount">(${getCheckedCategoryCount()}項目)</span>
            </button>
            
            <button class="btn btn-success btn-block mt-4" 
                    onclick="showSuggestions()">
                ✨ 提案を表示（API不要）
            </button>
            
            ${!useLocalAI && !apiKey ? `
                <p style="color: var(--warning-color); font-size: 13px; margin-top: 12px; text-align: center;">
                    ⚠️ AI機能を使うには<a href="#" onclick="openSettings(); return false;">設定</a>からAPIキーを入力してください
                </p>
            ` : ''}
        </div>
    `;

    container.innerHTML = html;
}

function onCheckChange() {
    saveCurrentCategoryData();
    renderCategoryTabs();
    document.getElementById('checkedCount').textContent = `(${getCheckedCategoryCount()}項目)`;
}

function saveCurrentCategoryData() {
    const category = ASSESSMENT_CATEGORIES[currentCategoryIndex];
    const checkedItems = [];

    category.checkItems.forEach((item, index) => {
        const checkbox = document.getElementById(`check-${index}`);
        if (checkbox && checkbox.checked) {
            checkedItems.push(item);
        }
    });

    const detailText = document.getElementById('detailText')?.value || '';

    assessmentData[category.id] = {
        checkedItems,
        detailText
    };
}

function getCheckedCategoryCount() {
    let count = 0;
    ASSESSMENT_CATEGORIES.forEach(cat => {
        const data = assessmentData[cat.id];
        if (data && data.checkedItems && data.checkedItems.length > 0) {
            count++;
        }
    });
    return count;
}

// ========================================
// AI生成
// ========================================
async function generateFromCategory() {
    saveCurrentCategoryData();

    const category = ASSESSMENT_CATEGORIES[currentCategoryIndex];
    const data = assessmentData[category.id];

    if (!data || data.checkedItems.length === 0) {
        alert('少なくとも1つの項目にチェックを入れてください');
        return;
    }

    showLoading(true);

    try {
        const result = await callAI(buildCategoryPrompt(category, data));

        carePlanItems.push({
            categoryName: category.name,
            ...result
        });

        showScreen('carePlanScreen');
    } catch (error) {
        alert('生成に失敗しました: ' + error.message);
    } finally {
        showLoading(false);
    }
}

async function generateFromAllCategories() {
    saveCurrentCategoryData();

    const checkedCategories = [];
    ASSESSMENT_CATEGORIES.forEach(cat => {
        const data = assessmentData[cat.id];
        if (data && data.checkedItems && data.checkedItems.length > 0) {
            checkedCategories.push({
                ...cat,
                data
            });
        }
    });

    if (checkedCategories.length === 0) {
        alert('少なくとも1つのカテゴリでチェックを入れてください');
        return;
    }

    showLoading(true);

    try {
        const results = await callAI(buildIntegratedPrompt(checkedCategories));

        if (Array.isArray(results)) {
            results.forEach(item => carePlanItems.push(item));
        }

        showScreen('carePlanScreen');
    } catch (error) {
        alert('統合生成に失敗しました: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// ========================================
// AI呼び出し
// ========================================
async function callAI(prompt) {
    console.log('プロンプト:', prompt);

    let responseText;

    if (useLocalAI && aiSession) {
        // ローカルAI
        updatePrivacyBadge(true, '端末内でAI処理中...');
        responseText = await aiSession.prompt(prompt);
        updatePrivacyBadge(true);
    } else if (apiKey) {
        // API（フォールバック）
        responseText = await callGeminiAPI(prompt);
    } else {
        throw new Error('AIが利用できません。設定からAPIキーを入力してください。');
    }

    console.log('AIレスポンス:', responseText);
    return parseAIResponse(responseText);
}

async function callGeminiAPI(prompt) {
    // 利用可能なモデル（2026年現在）
    const modelName = 'gemini-2.0-flash';

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048
            }
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData?.error?.message || `HTTPエラー ${response.status}`;
        throw new Error(translateApiError(errorMessage));
    }

    const result = await response.json();
    return result.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// APIエラーを日本語に変換
function translateApiError(errorMessage) {
    // 無料枠制限エラー
    if (errorMessage.includes('exceeded your current quota') ||
        errorMessage.includes('Quota exceeded') ||
        errorMessage.includes('rate limit')) {
        return `⚠️ Gemini API の無料枠制限に達しました。

【解決方法】
• しばらく待ってから再試行してください（1〜2分）
• 「✨ 提案を表示（API不要）」ボタンを使えば、APIを使わずにテンプレートから自動的にケアプランを生成できます！

💡 API不要モードなら制限を気にせず使えます。`;
    }

    // APIキーエラー
    if (errorMessage.includes('API_KEY_INVALID') ||
        errorMessage.includes('API key not valid')) {
        return `⚠️ APIキーが無効です。

【解決方法】
• 設定画面でAPIキーを確認してください
• Google AI StudioでAPIキーを再発行してください
• 「✨ 提案を表示（API不要）」ボタンなら、APIキーなしで使えます！`;
    }

    // モデルアクセスエラー
    if (errorMessage.includes('model not found') ||
        errorMessage.includes('permission denied')) {
        return `⚠️ AIモデルにアクセスできません。

【解決方法】
• 「✨ 提案を表示（API不要）」ボタンをお試しください
• APIキーなしでテンプレートから生成できます！`;
    }

    // その他のエラー
    return `⚠️ AI生成でエラーが発生しました。

${errorMessage}

【代替方法】
「✨ 提案を表示（API不要）」ボタンを使えば、APIを使わずにケアプランを生成できます！`;
}

function parseAIResponse(text) {
    try {
        const cleanedText = text
            .replace(/```json\s*/gi, '')
            .replace(/```\s*/g, '')
            .trim();

        // 配列を探す
        const arrayMatch = cleanedText.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
            return JSON.parse(arrayMatch[0]);
        }

        // オブジェクトを探す
        const objectMatch = cleanedText.match(/\{[\s\S]*\}/);
        if (objectMatch) {
            return JSON.parse(objectMatch[0]);
        }

        throw new Error('JSONが見つかりません');
    } catch (error) {
        console.error('パースエラー:', error);
        return {
            needs: '課題の把握が必要である',
            longTermGoal: '適切なケアを受けて安心して生活できる',
            shortTermGoal: '日常生活の課題を改善できる',
            serviceContent: '個別のケアプランに基づくサービス提供'
        };
    }
}

// ========================================
// プロンプト構築
// ========================================
function buildCategoryPrompt(category, data) {
    const serviceTypeName = SERVICE_TYPES[selectedServiceType]?.planName || 'サービス計画書（第2表）';

    return `あなたは介護支援専門員（ケアマネジャー）です。以下の情報から${serviceTypeName}を作成してください。

【カテゴリ】${category.name}
【課題項目】${data.checkedItems.join('、')}
${data.detailText ? `【具体的内容】${data.detailText}` : ''}

【記述ルール】
- ニーズは「〜〜だが、〜〜したい」という形式で1文にまとめる
- 長期目標は55文字以内で「〜〜できる」で終わる
- 短期目標は55文字以内で「〜〜できる」で終わる

以下のJSON形式で出力してください：
{
  "needs": "ニーズ（〜〜だが、〜〜したい）",
  "longTermGoal": "長期目標（55文字以内、〜〜できる）",
  "shortTermGoal": "短期目標（55文字以内、〜〜できる）",
  "serviceContent": "サービス内容"
}`;
}

// プロンプト圧縮: 特記事項がある項目のみ抽出
function compressAssessmentData(categories) {
    return categories
        .filter(cat => cat.data.checkedItems.length > 0 || cat.data.detailText)
        .map(cat => ({
            category: cat.name,
            issues: cat.data.checkedItems,
            detail: cat.data.detailText
        }));
}

function buildIntegratedPrompt(categories) {
    const serviceTypeName = SERVICE_TYPES[selectedServiceType]?.planName || 'サービス計画書（第2表）';

    // 圧縮されたカテゴリ情報（トークン削減）
    const compressed = compressAssessmentData(categories);
    const categoryInfo = compressed.map((item, i) => {
        let info = `${i + 1}. ${item.category}`;
        if (item.issues.length > 0) {
            info += `\n   課題: ${item.issues.join('、')}`;
        }
        if (item.detail) {
            info += `\n   詳細: ${item.detail}`;
        }
        return info;
    }).join('\n');

    // ローカルAI向けに最適化されたプロンプト（短く簡潔に）
    const outputCount = Math.min(compressed.length, 5);

    return `【${serviceTypeName}生成】

${categoryInfo}

【ルール】
- ニーズ: 「〜だが、〜したい」形式
- 長期目標: 55文字以内「〜できる」
- 短期目標: 55文字以内「〜できる」

【出力】JSON配列で${outputCount}件:
[{"categoryName":"名前","needs":"ニーズ","longTermGoal":"長期目標","shortTermGoal":"短期目標","serviceContent":"サービス"}]`;
}

// ========================================
// 計画書表示
// ========================================
function renderCarePlan() {
    const container = document.getElementById('carePlanContent');
    if (!container) return;

    if (carePlanItems.length === 0) {
        container.innerHTML = '<p class="text-center py-4">生成された計画書がありません</p>';
        return;
    }

    const html = `
        <div class="card" style="overflow-x: auto;">
            <table class="careplan-table">
                <thead>
                    <tr>
                        <th style="width: 80px;">カテゴリ</th>
                        <th>ニーズ</th>
                        <th>長期目標</th>
                        <th>短期目標</th>
                        <th>サービス内容</th>
                        <th style="width: 50px;"></th>
                    </tr>
                </thead>
                <tbody>
                    ${carePlanItems.map((item, index) => `
                        <tr>
                            <td>${item.categoryName || ''}</td>
                            <td>${item.needs || ''}</td>
                            <td>${item.longTermGoal || ''}</td>
                            <td>${item.shortTermGoal || ''}</td>
                            <td>${item.serviceContent || ''}</td>
                            <td>
                                <button onclick="deleteCarePlanItem(${index})" 
                                        style="background: none; border: none; cursor: pointer;">
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="card">
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <button class="btn btn-success" onclick="saveCarePlan()">💾 保存</button>
                <button class="btn btn-secondary" onclick="copyToClipboard()">📋 コピー</button>
                <button class="btn btn-secondary" onclick="exportToCSV()">📄 CSV出力</button>
                <button class="btn btn-primary" onclick="showScreen('assessmentScreen')">➕ 追加</button>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function deleteCarePlanItem(index) {
    if (confirm('この項目を削除しますか？')) {
        carePlanItems.splice(index, 1);
        renderCarePlan();
    }
}

// ========================================
// エクスポート
// ========================================
function copyToClipboard() {
    if (carePlanItems.length === 0) return;

    let text = `【${SERVICE_TYPES[selectedServiceType]?.planName || 'サービス計画書'}】\n\n`;

    carePlanItems.forEach((item, index) => {
        text += `■ ${index + 1}. ${item.categoryName}\n`;
        text += `【ニーズ】${item.needs}\n`;
        text += `【長期目標】${item.longTermGoal}\n`;
        text += `【短期目標】${item.shortTermGoal}\n`;
        text += `【サービス内容】${item.serviceContent}\n\n`;
    });

    navigator.clipboard.writeText(text).then(() => {
        alert('クリップボードにコピーしました');
    });
}

function exportToCSV() {
    if (carePlanItems.length === 0) return;

    const BOM = '\uFEFF';
    let csv = 'No.,カテゴリ,ニーズ,長期目標,短期目標,サービス内容\n';

    carePlanItems.forEach((item, index) => {
        const row = [
            index + 1,
            escapeCSV(item.categoryName),
            escapeCSV(item.needs),
            escapeCSV(item.longTermGoal),
            escapeCSV(item.shortTermGoal),
            escapeCSV(item.serviceContent)
        ];
        csv += row.join(',') + '\n';
    });

    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ケアプラン_${new Date().toLocaleDateString('ja-JP').replace(/\//g, '-')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function escapeCSV(str) {
    if (!str) return '';
    if (str.includes(',') || str.includes('\n') || str.includes('"')) {
        return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
}

// ========================================
// ローディング
// ========================================
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.toggle('hidden', !show);
    }

    if (show && useLocalAI) {
        updatePrivacyBadge(true, '端末内でAI処理中... インターネット接続は使用していません');
    }
}

// ========================================
// 設定
// ========================================
function openSettings() {
    showScreen('settingsScreen');
    document.getElementById('apiKeyInput').value = apiKey;
}

function saveSettings() {
    apiKey = document.getElementById('apiKeyInput').value.trim();
    localStorage.setItem('geminiApiKey', apiKey);
    alert('設定を保存しました');
    showScreen('homeScreen');
}

// ========================================
// 手動入力モーダル
// ========================================
function openManualEntryModal() {
    saveCurrentCategoryData();

    const category = ASSESSMENT_CATEGORIES[currentCategoryIndex];

    const modal = document.createElement('div');
    modal.id = 'manualEntryModal';
    modal.className = 'loading-overlay';
    modal.innerHTML = `
        <div class="loading-content" style="max-width: 500px; width: 90%; max-height: 90vh; overflow-y: auto; text-align: left;">
            <h3 style="margin-bottom: 16px;">${category.name} - 手動入力</h3>
            
            <div class="form-group">
                <label class="form-label">ニーズ（生活全般の解決すべき課題）</label>
                <textarea class="form-textarea" id="manualNeeds" placeholder="〜〜だが、〜〜したい" style="min-height: 60px;"></textarea>
            </div>
            
            <div class="form-group">
                <label class="form-label">長期目標（55文字以内）</label>
                <input type="text" class="form-input" id="manualLongTerm" placeholder="〜〜できる" maxlength="55">
            </div>
            
            <div class="form-group">
                <label class="form-label">短期目標（55文字以内）</label>
                <input type="text" class="form-input" id="manualShortTerm" placeholder="〜〜できる" maxlength="55">
            </div>
            
            <div class="form-group">
                <label class="form-label">サービス内容</label>
                <textarea class="form-textarea" id="manualService" placeholder="サービス内容を入力" style="min-height: 60px;"></textarea>
            </div>
            
            <div style="display: flex; gap: 12px; margin-top: 20px;">
                <button class="btn btn-secondary" style="flex: 1;" onclick="closeManualEntryModal()">キャンセル</button>
                <button class="btn btn-primary" style="flex: 1;" onclick="saveManualEntry('${category.name}')">保存</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function closeManualEntryModal() {
    const modal = document.getElementById('manualEntryModal');
    if (modal) {
        modal.remove();
    }
}

function saveManualEntry(categoryName) {
    const needs = document.getElementById('manualNeeds').value.trim();
    const longTermGoal = document.getElementById('manualLongTerm').value.trim();
    const shortTermGoal = document.getElementById('manualShortTerm').value.trim();
    const serviceContent = document.getElementById('manualService').value.trim();

    if (!needs || !longTermGoal || !shortTermGoal) {
        alert('ニーズ・長期目標・短期目標は必須です');
        return;
    }

    carePlanItems.push({
        categoryName,
        needs,
        longTermGoal,
        shortTermGoal,
        serviceContent
    });

    closeManualEntryModal();
    showScreen('carePlanScreen');
}

// ========================================
// 自動提案機能（API不要）
// ========================================
function showSuggestions() {
    // 現在のカテゴリのチェック項目を取得
    saveCurrentCategoryData();
    const category = ASSESSMENT_CATEGORIES[currentCategoryIndex];
    const data = assessmentData[category.id] || { checkedItems: [] };

    if (data.checkedItems.length === 0) {
        alert('項目をチェックしてから「提案を表示」をクリックしてください');
        return;
    }

    // チェック項目に対応するテンプレートを取得
    const suggestions = [];
    data.checkedItems.forEach(item => {
        if (ITEM_TEMPLATES && ITEM_TEMPLATES[item]) {
            suggestions.push({
                itemName: item,
                ...ITEM_TEMPLATES[item]
            });
        }
    });

    if (suggestions.length === 0) {
        alert('選択した項目に対応する提案が見つかりませんでした');
        return;
    }

    // 提案モーダルを表示
    showSuggestionModal(category.name, suggestions);
}

function showSuggestionModal(categoryName, suggestions) {
    const modal = document.createElement('div');
    modal.id = 'suggestionModal';
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        overflow-y: auto;
    `;

    const suggestionsHtml = suggestions.map((suggestion, index) => `
        <div class="suggestion-card" style="
            background: var(--card-bg);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 16px;
            border: 2px solid transparent;
            cursor: pointer;
            transition: all 0.2s;
        " onclick="toggleSuggestionSelect(${index})" id="suggestion-${index}">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                <input type="checkbox" id="suggestionCheck-${index}" checked style="width: 20px; height: 20px;">
                <strong style="color: var(--primary-color);">${suggestion.itemName}</strong>
            </div>
            <div style="font-size: 14px; line-height: 1.6;">
                <div style="margin-bottom: 8px;">
                    <span style="color: var(--text-secondary);">ニーズ：</span>
                    <span>${suggestion.needs}</span>
                </div>
                <div style="margin-bottom: 8px;">
                    <span style="color: var(--text-secondary);">長期目標：</span>
                    <span>${suggestion.longTermGoal}</span>
                </div>
                <div style="margin-bottom: 8px;">
                    <span style="color: var(--text-secondary);">短期目標：</span>
                    <span>${suggestion.shortTermGoal}</span>
                </div>
                <div>
                    <span style="color: var(--text-secondary);">サービス：</span>
                    <span>${suggestion.serviceContent}</span>
                </div>
            </div>
        </div>
    `).join('');

    modal.innerHTML = `
        <div style="
            background: var(--bg-color);
            border-radius: 16px;
            max-width: 600px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            padding: 24px;
        ">
            <h2 style="margin-bottom: 8px; color: var(--text-color);">✨ 提案内容</h2>
            <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 20px;">
                ${categoryName}のチェック項目から自動生成しました。<br>
                追加する項目を選択してください。
            </p>
            
            <div id="suggestionList">
                ${suggestionsHtml}
            </div>
            
            <div style="display: flex; gap: 12px; margin-top: 20px;">
                <button class="btn btn-secondary" style="flex: 1;" onclick="closeSuggestionModal()">
                    キャンセル
                </button>
                <button class="btn btn-primary" style="flex: 1;" onclick="addSelectedSuggestions()">
                    選択した項目を追加
                </button>
            </div>
            
            <p style="color: var(--text-secondary); font-size: 12px; text-align: center; margin-top: 16px;">
                💡 追加後に第2表で編集できます
            </p>
        </div>
    `;

    // グローバルに提案データを保存
    window.currentSuggestions = suggestions;

    document.body.appendChild(modal);

    // モーダル外クリックで閉じる
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeSuggestionModal();
        }
    });
}

function toggleSuggestionSelect(index) {
    const checkbox = document.getElementById(`suggestionCheck-${index}`);
    const card = document.getElementById(`suggestion-${index}`);

    if (checkbox && card) {
        checkbox.checked = !checkbox.checked;
        card.style.borderColor = checkbox.checked ? 'var(--primary-color)' : 'transparent';
        card.style.opacity = checkbox.checked ? '1' : '0.6';
    }
}

function closeSuggestionModal() {
    const modal = document.getElementById('suggestionModal');
    if (modal) {
        modal.remove();
    }
    window.currentSuggestions = null;
}

function addSelectedSuggestions() {
    const suggestions = window.currentSuggestions || [];
    let addedCount = 0;

    suggestions.forEach((suggestion, index) => {
        const checkbox = document.getElementById(`suggestionCheck-${index}`);
        if (checkbox && checkbox.checked) {
            carePlanItems.push({
                categoryName: suggestion.itemName,
                needs: suggestion.needs,
                longTermGoal: suggestion.longTermGoal,
                shortTermGoal: suggestion.shortTermGoal,
                serviceContent: suggestion.serviceContent
            });
            addedCount++;
        }
    });

    closeSuggestionModal();

    if (addedCount > 0) {
        showScreen('carePlanScreen');
    } else {
        alert('項目を選択してください');
    }
}

// ========================================
// 利用者管理機能
// ========================================
function renderUserList() {
    const container = document.getElementById('userListContent');
    if (!container) return;

    if (users.length === 0) {
        container.innerHTML = `
            <div class="card text-center">
                <p style="color: var(--text-secondary);">登録されている利用者はいません</p>
                <p style="font-size: 14px; color: var(--text-secondary);">「新規利用者を登録」から追加してください</p>
            </div>
        `;
        return;
    }

    const html = users.map(user => {
        const planCount = savedCarePlans.filter(p => p.userId === user.id).length;
        return `
            <div class="card user-card" style="cursor: pointer;" onclick="selectUser('${user.id}')">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-size: 20px; font-weight: 600; color: var(--primary-color);">
                            ${user.initial}
                        </div>
                        <div style="font-size: 14px; color: var(--text-secondary); margin-top: 4px;">
                            ${user.age}歳 / ${user.careLevel}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 12px; color: var(--text-secondary);">
                            計画書: ${planCount}件
                        </div>
                        <button class="btn btn-small btn-danger" onclick="event.stopPropagation(); deleteUser('${user.id}')" style="margin-top: 8px; padding: 4px 12px; font-size: 12px;">
                            削除
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
}

function openUserAddModal() {
    const modal = document.createElement('div');
    modal.id = 'userAddModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
    `;

    modal.innerHTML = `
        <div style="
            background: var(--bg-color);
            border-radius: 16px;
            max-width: 400px;
            width: 100%;
            padding: 24px;
        ">
            <h2 style="margin-bottom: 20px; color: var(--text-color);">👤 新規利用者登録</h2>
            
            <div class="form-group">
                <label class="form-label">イニシャル（例: Y.T）</label>
                <input type="text" class="form-input" id="userInitial" placeholder="Y.T" maxlength="10">
            </div>
            
            <div class="form-group">
                <label class="form-label">年齢</label>
                <input type="number" class="form-input" id="userAge" placeholder="85" min="0" max="120">
            </div>
            
            <div class="form-group">
                <label class="form-label">要介護度</label>
                <select class="form-input" id="userCareLevel">
                    <option value="要支援1">要支援1</option>
                    <option value="要支援2">要支援2</option>
                    <option value="要介護1">要介護1</option>
                    <option value="要介護2">要介護2</option>
                    <option value="要介護3" selected>要介護3</option>
                    <option value="要介護4">要介護4</option>
                    <option value="要介護5">要介護5</option>
                </select>
            </div>
            
            <div style="display: flex; gap: 12px; margin-top: 20px;">
                <button class="btn btn-secondary" style="flex: 1;" onclick="closeUserAddModal()">キャンセル</button>
                <button class="btn btn-primary" style="flex: 1;" onclick="saveNewUser()">登録</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeUserAddModal();
        }
    });
}

function closeUserAddModal() {
    const modal = document.getElementById('userAddModal');
    if (modal) modal.remove();
}

function saveNewUser() {
    const initial = document.getElementById('userInitial').value.trim();
    const age = parseInt(document.getElementById('userAge').value) || 0;
    const careLevel = document.getElementById('userCareLevel').value;

    if (!initial) {
        alert('イニシャルを入力してください');
        return;
    }

    if (age < 0 || age > 120) {
        alert('年齢を正しく入力してください');
        return;
    }

    const newUser = {
        id: Date.now().toString(),
        initial,
        age,
        careLevel,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('careplan_users', JSON.stringify(users));

    closeUserAddModal();
    renderUserList();
}

function selectUser(userId) {
    currentUserId = userId;
    const user = users.find(u => u.id === userId);

    if (user) {
        // 利用者の保存済み計画書があるか確認
        const userPlans = savedCarePlans.filter(p => p.userId === userId);

        if (userPlans.length > 0) {
            // 計画書がある場合は選択モーダルを表示
            showUserPlanSelectModal(user, userPlans);
        } else {
            // 計画書がない場合は新規作成へ
            showScreen('homeScreen');
        }
    }
}

function showUserPlanSelectModal(user, plans) {
    const modal = document.createElement('div');
    modal.id = 'planSelectModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
    `;

    const planListHtml = plans.map(plan => {
        const date = new Date(plan.updatedAt).toLocaleDateString('ja-JP');
        return `
            <div class="card" style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="cursor: pointer; flex: 1;" onclick="loadCarePlan('${plan.id}')">
                        <div style="font-weight: 600;">${SERVICE_TYPES[plan.serviceType]?.name || plan.serviceType}</div>
                        <div style="font-size: 12px; color: var(--text-secondary);">${plan.items.length}項目 / ${date}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <button class="btn btn-danger" style="padding: 6px 12px; font-size: 12px;" onclick="event.stopPropagation(); deleteCarePlan('${plan.id}')">
                            🗑️
                        </button>
                        <span style="color: var(--primary-color); cursor: pointer;" onclick="loadCarePlan('${plan.id}')">→</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    modal.innerHTML = `
        <div style="
            background: var(--bg-color);
            border-radius: 16px;
            max-width: 400px;
            width: 100%;
            padding: 24px;
            max-height: 80vh;
            overflow-y: auto;
        ">
            <h2 style="margin-bottom: 8px; color: var(--text-color);">${user.initial}さんの計画書</h2>
            <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 20px;">
                読み込む計画書を選択するか、新規作成してください
            </p>
            
            ${planListHtml}
            
            <div style="display: flex; gap: 12px; margin-top: 20px;">
                <button class="btn btn-secondary" style="flex: 1;" onclick="closePlanSelectModal()">キャンセル</button>
                <button class="btn btn-primary" style="flex: 1;" onclick="closePlanSelectModal(); showScreen('homeScreen')">新規作成</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closePlanSelectModal();
        }
    });
}

function closePlanSelectModal() {
    const modal = document.getElementById('planSelectModal');
    if (modal) modal.remove();
}

function loadCarePlan(planId) {
    const plan = savedCarePlans.find(p => p.id === planId);
    if (plan) {
        currentPlanId = planId; // 編集中の計画書を設定
        selectedServiceType = plan.serviceType;
        carePlanItems = [...plan.items];
        assessmentData = plan.assessmentData || {};
        closePlanSelectModal();
        showScreen('carePlanScreen');
    }
}

function deleteCarePlan(planId) {
    // iOS対応: カスタム確認モーダルを表示
    showDeleteConfirmModal(planId, 'plan');
}

function showDeleteConfirmModal(targetId, type) {
    const modal = document.createElement('div');
    modal.id = 'deleteConfirmModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        z-index: 1100;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
    `;

    const title = type === 'plan' ? '計画書を削除' : '利用者を削除';
    const message = type === 'plan'
        ? 'この計画書を削除しますか？'
        : 'この利用者を削除しますか？関連する計画書も削除されます。';

    modal.innerHTML = `
        <div style="
            background: var(--bg-color);
            border-radius: 16px;
            max-width: 350px;
            width: 100%;
            padding: 24px;
        ">
            <h2 style="margin-bottom: 12px; color: var(--text-color);">🗑️ ${title}</h2>
            <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 20px;">
                ${message}
            </p>
            
            <div style="display: flex; gap: 12px;">
                <button class="btn btn-secondary" style="flex: 1;" onclick="closeDeleteConfirmModal()">
                    キャンセル
                </button>
                <button class="btn btn-danger" style="flex: 1;" onclick="closeDeleteConfirmModal(); doDelete('${targetId}', '${type}')">
                    削除する
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeDeleteConfirmModal();
        }
    });
}

function closeDeleteConfirmModal() {
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) modal.remove();
}

function doDelete(targetId, type) {
    if (type === 'plan') {
        savedCarePlans = savedCarePlans.filter(p => p.id !== targetId);
        localStorage.setItem('careplan_plans', JSON.stringify(savedCarePlans));

        if (currentPlanId === targetId) {
            currentPlanId = null;
        }

        // モーダルを再描画
        closePlanSelectModal();

        // 計画書が残っている場合はモーダルを再表示
        const user = users.find(u => u.id === currentUserId);
        const userPlans = savedCarePlans.filter(p => p.userId === currentUserId);
        if (user && userPlans.length > 0) {
            showUserPlanSelectModal(user, userPlans);
        }

        showToast('計画書を削除しました');
    } else if (type === 'user') {
        users = users.filter(u => u.id !== targetId);
        savedCarePlans = savedCarePlans.filter(p => p.userId !== targetId);

        localStorage.setItem('careplan_users', JSON.stringify(users));
        localStorage.setItem('careplan_plans', JSON.stringify(savedCarePlans));

        if (currentUserId === targetId) {
            currentUserId = null;
        }

        renderUserList();
        showToast('利用者を削除しました');
    }
}

// トースト通知（alertの代わり）
function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--text-color);
        color: var(--bg-color);
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

function deleteUser(userId) {
    // iOS対応: カスタム確認モーダルを表示
    showDeleteConfirmModal(userId, 'user');
}

// ========================================
// 計画書保存機能
// ========================================
function saveCarePlan() {
    if (carePlanItems.length === 0) {
        alert('保存する項目がありません');
        return;
    }

    // 既存の計画書を読み込んでいる場合は選択モーダルを表示
    if (currentPlanId) {
        showSaveOptionsModal();
    } else {
        // 新規保存
        doSaveCarePlan(false);
    }
}

function showSaveOptionsModal() {
    const modal = document.createElement('div');
    modal.id = 'saveOptionsModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
    `;

    modal.innerHTML = `
        <div style="
            background: var(--bg-color);
            border-radius: 16px;
            max-width: 400px;
            width: 100%;
            padding: 24px;
        ">
            <h2 style="margin-bottom: 16px; color: var(--text-color);">💾 保存方法を選択</h2>
            <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 20px;">
                既存の計画書を読み込んでいます。どのように保存しますか？
            </p>
            
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <button class="btn btn-primary btn-block" onclick="closeSaveOptionsModal(); doSaveCarePlan(true)">
                    🔄 上書き保存
                </button>
                <button class="btn btn-success btn-block" onclick="closeSaveOptionsModal(); doSaveCarePlan(false)">
                    ➕ 新規として保存
                </button>
                <button class="btn btn-secondary btn-block" onclick="closeSaveOptionsModal()">
                    キャンセル
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeSaveOptionsModal();
        }
    });
}

function closeSaveOptionsModal() {
    const modal = document.getElementById('saveOptionsModal');
    if (modal) modal.remove();
}

function doSaveCarePlan(overwrite) {
    const now = new Date().toISOString();

    if (overwrite && currentPlanId) {
        // 上書き保存
        const planIndex = savedCarePlans.findIndex(p => p.id === currentPlanId);
        if (planIndex !== -1) {
            savedCarePlans[planIndex].items = [...carePlanItems];
            savedCarePlans[planIndex].assessmentData = { ...assessmentData };
            savedCarePlans[planIndex].updatedAt = now;
            localStorage.setItem('careplan_plans', JSON.stringify(savedCarePlans));
            alert('計画書を上書き保存しました');
            return;
        }
    }

    // 新規保存
    const planId = Date.now().toString();
    const plan = {
        id: planId,
        userId: currentUserId,
        serviceType: selectedServiceType,
        items: [...carePlanItems],
        assessmentData: { ...assessmentData },
        createdAt: now,
        updatedAt: now
    };

    savedCarePlans.push(plan);
    localStorage.setItem('careplan_plans', JSON.stringify(savedCarePlans));
    currentPlanId = planId; // 新規保存後はこの計画書を編集中に
    alert('計画書を新規保存しました');
}

// showScreen関数を更新してuserListScreenに対応
const originalShowScreen = showScreen;
showScreen = function (screenId) {
    originalShowScreen(screenId);

    if (screenId === 'userListScreen') {
        renderUserList();
    }
};
