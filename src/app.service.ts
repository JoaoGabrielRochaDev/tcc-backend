import { Injectable } from '@nestjs/common';
import { Neo4jService } from './neo4j/neo4j.service';

@Injectable()
export class AppService {
  constructor(private readonly neo4jService: Neo4jService) {}
  async getHello(): Promise<string> {
    const result = await this.neo4jService.read(
      'MATCH (n) RETURN count(n) AS count',
      {},
    );
    const count = result.records[0].get('count');
    return `hello neo4j user! there are ${count} of nodes in the database`;
  }
}
