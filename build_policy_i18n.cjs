/**
 * build_policy_i18n.cjs
 * Builds src/data/larkPoliciesI18n.json with {en, vi, zh} content per policy.
 * BOTH en and vi use larkPolicies.json (already formatted, mixed VI+EN).
 * zh is left empty so GTranslate handles translation from the EN div.
 */
const fs = require('fs');

const viPolicies = JSON.parse(fs.readFileSync('./src/data/larkPolicies.json', 'utf8'));

const i18nPolicies = viPolicies.map(policy => ({
    id: policy.id,
    title: {
        en: policy.title,
        vi: policy.title,
        zh: policy.title
    },
    content: {
        // EN and VI both use the same formatted content from larkPolicies.json
        // (which already has VI headers/bullets + EN body text)
        en: policy.content,
        vi: policy.content,
        zh: '' // empty → component renders EN content with lang="en" so GTranslate handles ZH
    }
}));

fs.writeFileSync('./src/data/larkPoliciesI18n.json', JSON.stringify(i18nPolicies, null, 2));
console.log('✅ larkPoliciesI18n.json written with', i18nPolicies.length, 'policies');
i18nPolicies.forEach(p => {
    console.log(`  ${p.id}: ${p.content.en.length}ch`);
});
