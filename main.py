from src.cnnClassifier import logger

from cnnClassifier.pipeline.stage_01_data_ingestion import DataIngestionTrainingPipeline

from cnnClassifier.pipeline.stage_02_prepare_base_model import PrepareBaseModelTrainingPipeline

from cnnClassifier.pipeline.stage_03_model_training import ModelTrainingPipeline

STAGE_NAME = "Data Ingestion Stage"

try:
    logger.info(f">>>>>> stage {STAGE_NAME} started <<<<<<")
    obj = DataIngestionTrainingPipeline()
    obj.main()
    logger.info(f">>>>>> stage {STAGE_NAME} completed <<<<<<\n\nx==========x")
except Exception as e:
    logger.exception(f"error in stage {STAGE_NAME}: {e}")
    raise e


STAGE_NAME = "Prepare Base Model Stage"

try:
    logger.info(f">>>>>> stage {STAGE_NAME} started <<<<<<")
    obj = PrepareBaseModelTrainingPipeline()
    obj.main()
    logger.info(f">>>>>> stage {STAGE_NAME} completed <<<<<<\n\nx==========x")
except Exception as e:
    logger.exception(f"error in stage {STAGE_NAME}: {e}")
    raise e


STAGE_NAME = "Model Training Stage"

try:
    logger.info(f">>>>>> stage {STAGE_NAME} started <<<<<<")
    obj = ModelTrainingPipeline()
    obj.main()
    logger.info(f">>>>>> stage {STAGE_NAME} completed <<<<<<\n\nx==========x")
except Exception as e:
    logger.exception(f"error in stage {STAGE_NAME}: {e}")
    raise e