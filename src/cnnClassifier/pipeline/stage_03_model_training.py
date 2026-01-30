from cnnClassifier.config.configuration import ConfigurationManager
from cnnClassifier.components.model_training import PrepareTrainingComponent
from cnnClassifier import logger

STAGE_NAME = "Model Training Stage"

class ModelTrainingPipeline:
    
    def __init__(self):
        pass
    
    def main(self):
        config = ConfigurationManager()
        training_config = config.get_training_config()
        training = PrepareTrainingComponent(config=training_config)
        training.get_base_model()
        training.train_valid_model()
        training.train()
        
if __name__ == "__main__":
    try:
        logger.info(f">>>>>> stage {STAGE_NAME} started <<<<<<")
        obj = ModelTrainingPipeline()
        obj.main()
        logger.info(f">>>>>> stage {STAGE_NAME} completed <<<<<<\n\nx==========x")
    except Exception as e:
        logger.exception(f"error in stage {STAGE_NAME}: {e}")
        raise e