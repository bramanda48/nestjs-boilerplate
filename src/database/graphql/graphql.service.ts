import {
    ApolloClient,
    ApolloQueryResult,
    DocumentNode,
    HttpLink,
    InMemoryCache,
    NormalizedCacheObject,
    OperationVariables
    } from '@apollo/client/core';
import { ServiceDescription, ServiceRegistry } from '@bramanda48/nestjs-service-registry';
import { Injectable, Logger } from '@nestjs/common';
import fetch from 'cross-fetch';
import { RequestContext } from 'nestjs-request-context';

@Injectable()
export class GraphqlService {
    // Graphql instance
    private graphql: Record<string, ApolloClient<NormalizedCacheObject>> = {};
    private readonly logger: Logger = new Logger(GraphqlService.name);
    
    constructor(
        private readonly serviceRegistry: ServiceRegistry
    ) { }

    async setClient(name: string, url: string) {
        const header = RequestContext.currentContext.req.headers;
        this.graphql[name] = new ApolloClient({
            link: new HttpLink({
                uri: url + '/graphql',
                fetch,
                headers: {
                    authorization: `${header['authorization']}`
                },
            }),
            cache: new InMemoryCache()
        });
    }

    async createConnection(
        name: string
    ): Promise<ApolloClient<NormalizedCacheObject>> {
        try {
            if(!this.graphql.hasOwnProperty(name)) {
                let service: ServiceDescription = await this.serviceRegistry.GetService(name);
                if(!service) {
                    throw new Error(`Cannot find graphql service: '${name}'`)
                }
                this.setClient(name, service.host);
            }
            return this.graphql[name]
        } catch(e) {
            this.logger.error(e.stack);
            return null;
        }
    }

    async query<T, K = OperationVariables>(data: {
        service: string,
        query?: DocumentNode
        variables?: K
    }): Promise<ApolloQueryResult<T>> {
        const  connection = await this.createConnection(data.service);
        return connection.query<T, K>({
            query: data.query,
            variables: data.variables
        });
    }

    async mutate<T, K = OperationVariables>(data: {
        service: string,
        mutate?: DocumentNode,
        variables?: K
    }) {
        const  connection = await this.createConnection(data.service);
        return connection.mutate<T, K>({
            mutation: data.mutate,
            variables: data.variables
        });
    }
}