import { Injectable } from '@nestjs/common';
import { HfInference } from '@huggingface/inference';

@Injectable()
export class RecommendationService {
    private hf: HfInference;
    private model = 'sentence-transformers/all-MiniLM-L6-v2';
  
    constructor() {
      this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
    }
    
    // Text to embedding
    async getEmbedding(text: string): Promise<number[]> {
      const result = await this.hf.featureExtraction({
        model: this.model,
        inputs: text,
      });
      return result as number[];
    }
}
