import os
from dotenv import load_dotenv
from cnnClassifier.constants import *
from cnnClassifier.utils.common import read_yaml, create_directories
from cnnClassifier.entity.config_entity import (DataIngestionConfig, PrepareBaseModelConfig, TrainingConfig, EvaluationConfig)

load_dotenv()

# source_URL = config.source_URL or os.dotenv.get("DATA_SOURCE_URL")

class ConfigurationManager:
    def __init__(
        self,
        config_filepath=CONFIG_FILE_PATH,
        params_filepath=PARAMS_FILE_PATH,):
        self.config = read_yaml(config_filepath)
        self.params = read_yaml(params_filepath)
        
        create_directories([self.config.artifacts_root])
    
    
    # Defining method to get data ingestion config
    def get_data_ingestion_config(self) -> DataIngestionConfig:
        config = self.config.data_ingestion
        
        data_ingetion_config = DataIngestionConfig(
            root_dir = config.root_dir,
            source_URL = os.getenv("DATA_SOURCE_URL"),
            local_data_file = config.local_data_file,
            unzip_dir = config.unzip_dir,
        )
        return data_ingetion_config
    
    
    # Defining method to get prepare base model config
    def get_prepare_base_model_config(self) -> PrepareBaseModelConfig:
        config = self.config.prepare_base_model
        
        create_directories([config.root_dir])
        
        prepare_base_model_config = PrepareBaseModelConfig(
            root_dir=Path(config.root_dir),
            base_model_path=Path(config.base_model_path),
            updated_base_model_path=Path(config.updated_base_model_path),
            params_image_size=self.params.IMAGE_SIZE,
            params_learning_rate=self.params.LEARNING_RATE,
            params_include_top=self.params.INCLUDE_TOP,
            params_weights=self.params.WEIGHTS,
            params_classes=self.params.CLASSES
        )
        
        return prepare_base_model_config
    
    
    # Defining method to get training config
    def get_training_config(self) -> TrainingConfig:
        training= self.config.training
        prepare_base_model = self.config.prepare_base_model
        params = self.params
        training_data = os.path.join(self.config.data_ingestion.unzip_dir,"Chest CT Scan data")
        create_directories([training.root_dir])
        
        training_config = TrainingConfig(
            root_dir = training.root_dir,
            trained_model_path = training.trained_model_path,
            updated_base_model_path = prepare_base_model.updated_base_model_path,
            training_data = training_data,
            params_epochs = params.EPOCHS,
            params_batch_size = params.BATCH_SIZE,
            params_is_augmentation = params.AUGMENTATION,
            params_image_size = params.IMAGE_SIZE
        )
        
        return training_config
    
    
    # Defining method to get evaluation config
    def get_evaluation_config(self) -> EvaluationConfig:
        eval_config = EvaluationConfig(
            path_of_model = "artifacts/training/model.h5",
            training_data = "artifacts/data_ingestion/Chest CT Scan data",
            all_params = self.params,
            
            # mlflow_uri = "https://dagshub.com/lixxxxxx5/xxxx-yyyyy-zzzzz.mlflow",
            
            mlflow_uri = os.environ.get("MLFLOW_TRACKING_URI"),
            params_image_size = self.params.IMAGE_SIZE,
            params_batch_size = self.params.BATCH_SIZE
        )
        return eval_config