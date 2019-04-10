import {Client, expect} from '@loopback/testlab';
import {WafApplication} from '../..';
import {setupApplication, teardownApplication} from '../helpers/test-helper';
import {
  givenEmptyDatabase,
  givenConditionData,
  givenRuleData,
  createConditionObject,
} from '../helpers/database.helpers';
import uuid = require('uuid');

describe('ConditionController', () => {
  let wafapp: WafApplication;
  let client: Client;

  const prefix = '/adcaas/v1';

  before('setupApplication', async () => {
    ({wafapp, client} = await setupApplication());
  });
  beforeEach('Empty database', async () => {
    await givenEmptyDatabase(wafapp);
  });

  after(async () => {
    await teardownApplication(wafapp);
  });

  it('post ' + prefix + '/rules/{ruleId}/conditions', async () => {
    const rule = await givenRuleData(wafapp);
    const condition = createConditionObject({id: uuid()});

    const response = await client
      .post(prefix + `/rules/${rule.id}/conditions`)
      .send(condition)
      .expect(200);

    expect(response.body.condition.id)
      .to.not.empty()
      .and.type('string');
  });

  it('get ' + prefix + '/rules/{ruleId}/conditions/{conditionId}', async () => {
    const rule = await givenRuleData(wafapp);
    const condition = await givenConditionData(wafapp, {
      id: uuid(),
      ruleId: rule.id,
    });

    const response = await client
      .get(prefix + `/rules/${rule.id}/conditions/${condition.id}`)
      .expect(200);

    expect(response.body.conditions[0].id)
      .to.not.empty()
      .and.type('string');
  });

  it('get ' + prefix + '/rules/{ruleId}/conditions', async () => {
    const rule = await givenRuleData(wafapp);
    await givenConditionData(wafapp, {id: uuid(), ruleId: rule.id});
    await givenConditionData(wafapp, {id: uuid(), ruleId: rule.id});

    const response = await client
      .get(prefix + `/rules/${rule.id}/conditions`)
      .expect(200);

    expect(response.body.conditions)
      .be.instanceOf(Array)
      .and.have.length(2);
  });

  it(
    'delete ' + prefix + '/rules/{ruleId}/conditions/{conditionId}',
    async () => {
      const rule = await givenRuleData(wafapp);
      const condition = await givenConditionData(wafapp, {
        id: uuid(),
        ruleId: rule.id,
      });
      await client
        .del(prefix + `/rules/${rule.id}/conditions/${condition.id}`)
        .expect(204);

      await client
        .get(prefix + `/rules/${rule.id}/conditions/${condition.id}`)
        .expect(200);
    },
  );

  it(
    'patch ' + prefix + '/rules/{ruleId}/conditions/{conditionId}',
    async () => {
      const rule = await givenRuleData(wafapp);
      const conditionInDb = await givenConditionData(wafapp, {
        id: uuid(),
        ruleId: rule.id,
      });

      const condition = createConditionObject({
        id: conditionInDb.id,
        type: 'request',
      });
      const response = await client
        .patch(prefix + `/rules/${rule.id}/conditions/${condition.id}`)
        .send(condition)
        .expect(200);

      expect(response.body.count).to.eql(1);
    },
  );
});