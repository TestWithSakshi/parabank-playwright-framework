import * as allure from 'allure-js-commons';

export type Feature = 'Sign Up' | 'Sign In';
export type Story = 'positive' | 'negative';

export async function tagSuite(feature: Feature, story: Story): Promise<void> {
  await allure.owner('Sakshi Jindal');
  await allure.feature(feature);
  await allure.story(story);
  await allure.severity(story === 'positive' ? 'critical' : 'normal');
  await allure.layer('e2e');
  await allure.label('framework', 'Playwright + TypeScript');
  await allure.label('app', 'Parabank');
}
