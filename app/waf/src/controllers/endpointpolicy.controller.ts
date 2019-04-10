import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  del,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import {Endpointpolicy, Rule, Service} from '../models';
import {
  EndpointpolicyRepository,
  ServiceRepository,
  ServiceEndpointpolicyAssociationRepository,
} from '../repositories';
import {Schema, Response, CollectionResponse} from '.';

const prefix = '/adcaas/v1';

const createDesc: string = 'Endpointpolicy resource that need to be created';
const updateDesc: string =
  'Endpointpolicy resource properties that need to be updated';

const createRuleDesc: string = 'Rule resource that need to be created';
const updateRuleDesc: string =
  'Rule resource properties that need to be updated';

export class EndpointpolicyController {
  constructor(
    @repository(EndpointpolicyRepository)
    public endpointpolicyRepository: EndpointpolicyRepository,
    @repository(ServiceRepository)
    public serviceRepository: ServiceRepository,
    @repository(ServiceEndpointpolicyAssociationRepository)
    public serviceEndpointpolicyAssociationRepository: ServiceEndpointpolicyAssociationRepository,
  ) {}

  @post(prefix + '/endpointpolicies', {
    responses: {
      '200': Schema.response(
        Endpointpolicy,
        'Successfully create Endpointpolicy resource',
      ),
      '400': Schema.badRequest('Invalid Endpointpolicy resource'),
      '422': Schema.unprocessableEntity(
        'Unprocessable Endpointpolicy resource',
      ),
    },
  })
  async create(
    @requestBody(Schema.createRequest(Endpointpolicy, createDesc))
    reqBody: Partial<Endpointpolicy>,
  ): Promise<Response> {
    try {
      const data = await this.endpointpolicyRepository.create(reqBody);
      return new Response(Endpointpolicy, data);
    } catch (error) {
      throw new HttpErrors.BadRequest(error.message);
    }
  }

  @get(prefix + '/endpointpolicies/count', {
    responses: {
      '200': {
        description: 'Endpointpolicy model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Endpointpolicy))
    where?: Where,
  ): Promise<Count> {
    return await this.endpointpolicyRepository.count(where);
  }

  @get(prefix + '/endpointpolicies', {
    responses: {
      '200': Schema.collectionResponse(
        Endpointpolicy,
        'Successfully retrieve Endpointpolicy resources',
      ),
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Endpointpolicy))
    filter?: Filter,
  ): Promise<CollectionResponse> {
    const data = await this.endpointpolicyRepository.find(filter);
    return new CollectionResponse(Endpointpolicy, data);
  }

  @get(prefix + '/endpointpolicies/{endpointpolicyId}', {
    responses: {
      '200': Schema.response(
        Endpointpolicy,
        'Successfully retrieve Endpointpolicy resource',
      ),
      '404': Schema.notFound('Can not find Endpointpolicy resource'),
    },
  })
  async findById(
    @param(
      Schema.pathParameter('endpointpolicyId', 'Endponitpolicy resource ID'),
    )
    id: string,
  ): Promise<Response> {
    const data = await this.endpointpolicyRepository.findById(id);
    return new Response(Endpointpolicy, data);
  }

  @patch(prefix + '/endpointpolicies/{endpointpolicyId}', {
    responses: {
      '204': Schema.emptyResponse(
        'Successfully update Endpointpolicy resource',
      ),
      '404': Schema.notFound('Can not find Endpointpolicy resource'),
    },
  })
  async updateById(
    @param(
      Schema.pathParameter('endpointpolicyId', 'Endpointpolicy resource ID'),
    )
    id: string,
    @requestBody(Schema.createRequest(Endpointpolicy, updateDesc))
    epp: Endpointpolicy,
  ): Promise<void> {
    await this.endpointpolicyRepository.updateById(id, epp);
  }

  @del(prefix + '/endpointpolicies/{endpointpolicyId}', {
    responses: {
      '204': Schema.emptyResponse(
        'Successfully delete Endpointpolicy resource',
      ),
      '404': Schema.notFound('Can not find Endpointpolicy resource'),
    },
  })
  async deleteById(
    @param(
      Schema.pathParameter('endpointpolicyId', 'Endpointpolicy resource ID'),
    )
    id: string,
  ): Promise<void> {
    await this.endpointpolicyRepository.deleteById(id);
  }

  @post(prefix + '/endpointpolicies/{endpointpolicyId}/rules', {
    responses: {
      '200': Schema.response(Rule, 'Successfully create rule resource'),
      '400': Schema.badRequest('Invalid Rule resource'),
      '422': Schema.unprocessableEntity('Unprocessable Rule resource'),
    },
  })
  async createEndpointpolicyRule(
    @param(
      Schema.pathParameter('endpointpolicyId', 'Endpointpolicy resource ID'),
    )
    endpointpolicyId: string,
    @requestBody(Schema.createRequest(Endpointpolicy, createRuleDesc))
    rule: Partial<Rule>,
  ): Promise<Response> {
    const data = await this.endpointpolicyRepository
      .rules(endpointpolicyId)
      .create(rule);
    return new Response(Rule, data);
  }

  @get(prefix + '/endpointpolicies/{endpointpolicyId}/rules', {
    responses: {
      '200': Schema.collectionResponse(
        Rule,
        'Successfully retrieve rule resources by endpointpolicy id',
      ),
    },
  })
  async getRules(
    @param(
      Schema.pathParameter('endpointpolicyId', 'Endpointpolicy resource ID'),
    )
    endpointpolicyId: string,
  ): Promise<CollectionResponse> {
    const data = await this.endpointpolicyRepository
      .rules(endpointpolicyId)
      .find();
    return new CollectionResponse(Rule, data);
  }

  @get(prefix + '/endpointpolicies/{endpointpolicyId}/rules/{ruleId}', {
    responses: {
      '200': Schema.collectionResponse(
        Rule,
        'Successfully retrieve rule resources',
      ),
    },
  })
  async getRuleByID(
    @param(
      Schema.pathParameter('endpointpolicyId', 'Endpointpolicy resource ID'),
    )
    endpointpolicyId: string,
    @param(Schema.pathParameter('ruleId', 'Rule resource ID'))
    ruleId: string,
  ): Promise<CollectionResponse> {
    const data = await this.endpointpolicyRepository
      .rules(endpointpolicyId)
      .find({where: {id: ruleId}});
    return new CollectionResponse(Rule, data);
  }

  @del(prefix + '/endpointpolicies/{endpointpolicyId}/rules/{ruleId}', {
    responses: {
      '204': {
        description: 'Rules DELETE success',
      },
    },
  })
  async deleteRuleByID(
    @param(
      Schema.pathParameter('endpointpolicyId', 'Endpointpolicy resource ID'),
    )
    endpointpolicyId: string,
    @param(Schema.pathParameter('ruleId', 'Rule resource ID'))
    ruleId: string,
  ) {
    await this.endpointpolicyRepository
      .rules(endpointpolicyId)
      .delete({id: ruleId});
  }

  @patch(prefix + '/endpointpolicies/{endpointpolicyId}/rules/{ruleId}', {
    responses: {
      '200': {
        description: 'Rule model instance',
        content: {'application/json': {schema: {'x-ts-type': Rule}}},
      },
    },
  })
  async updateRuleByID(
    @param(
      Schema.pathParameter('endpointpolicyId', 'Endpointpolicy resource ID'),
    )
    endpointpolicyId: string,
    @param(Schema.pathParameter('ruleId', 'Rule resource ID'))
    ruleId: string,
    @requestBody(Schema.createRequest(Rule, updateRuleDesc))
    rule: Partial<Rule>,
  ): Promise<Count> {
    return await this.endpointpolicyRepository
      .rules(endpointpolicyId)
      .patch(rule, {id: ruleId});
  }

  @get(prefix + '/endpointpolicies/{endpointpolicyId}/services', {
    responses: {
      '200': Schema.collectionResponse(
        Service,
        'Successfully retrieve Service resources',
      ),
    },
  })
  async findServices(
    @param(
      Schema.pathParameter('endpointpolicyId', 'Endpoint Policy resource ID'),
    )
    id: string,
  ): Promise<CollectionResponse> {
    let assocs = await this.serviceEndpointpolicyAssociationRepository.find({
      where: {
        endpointpolicyId: id,
      },
    });

    let serviceIds = assocs.map(({serviceId}) => serviceId);
    return new CollectionResponse(
      Service,
      await this.serviceRepository.find({
        where: {
          id: {
            inq: serviceIds,
          },
        },
      }),
    );
  }

  @get(prefix + '/endpointpolicies/{endpointpolicyId}/services/{serviceId}', {
    responses: {
      '200': Schema.response(Service, 'Successfully retrieve Service resource'),
    },
  })
  async findService(
    @param(
      Schema.pathParameter('endpointpolicyId', 'Endpoint Policy resource ID'),
    )
    endpointpolicyId: string,
    @param(Schema.pathParameter('serviceId', 'Service resource ID'))
    serviceId: string,
  ): Promise<Response> {
    let assocs = await this.serviceEndpointpolicyAssociationRepository.find({
      where: {
        serviceId: serviceId,
        endpointpolicyId: endpointpolicyId,
      },
    });

    if (assocs.length === 0) {
      throw new HttpErrors.NotFound('Cannot find association.');
    } else {
      return new Response(
        Service,
        await this.serviceRepository.findById(assocs[0].serviceId),
      );
    }
  }
}