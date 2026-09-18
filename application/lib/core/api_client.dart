import 'dart:convert';

import 'package:http/http.dart' as http;

import '../models/chat_message.dart';
import '../models/character.dart';
import '../models/conversation.dart';
import 'api_exception.dart';

class ApiClient {
  ApiClient(this.baseUrl);

  final String baseUrl;

  Future<List<Character>> getCharacters() async {
    final body = await _get('/characters');
    return (body as List).map((e) => Character.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<List<Conversation>> getConversations() async {
    final body = await _get('/conversations');
    return (body as List).map((e) => Conversation.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<Conversation> createConversation({required String characterId, String? worldId}) async {
    final body = await _post('/conversations', {
      'characterId': characterId,
      'worldId': ?worldId,
    });
    return Conversation.fromJson(body as Map<String, dynamic>);
  }

  Future<List<ChatMessage>> getMessages(String conversationId) async {
    final body = await _get('/conversations/$conversationId/messages');
    return (body as List).map((e) => ChatMessage.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<ChatMessage> sendMessage(String conversationId, String message) async {
    final body = await _post('/conversations/$conversationId/messages', {'message': message});
    return ChatMessage.fromJson(body['message'] as Map<String, dynamic>);
  }

  Future<dynamic> _get(String path) async {
    final response = await http.get(Uri.parse('$baseUrl$path'));
    return _decode(response);
  }

  Future<dynamic> _post(String path, Map<String, dynamic> payload) async {
    final response = await http.post(
      Uri.parse('$baseUrl$path'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(payload),
    );
    return _decode(response);
  }

  dynamic _decode(http.Response response) {
    final decoded = response.body.isEmpty ? null : jsonDecode(response.body);
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return decoded;
    }
    final message = decoded is Map<String, dynamic> ? decoded['error'] as String? : null;
    throw ApiException(message ?? 'Request failed (${response.statusCode})');
  }
}
